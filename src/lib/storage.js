import { supabase } from './supabase';

// simple uuid gen - no dependencies needed fr
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// default 50 MB quota - adjust as needed
const DEFAULT_QUOTA_BYTES = 50 * 1024 * 1024;

// storage fr - handle uploads, downloads, deletes like a boss
// this is where the magic happens ngl

export const getUserStorageTotal = async (userId) => {
  try {
    // call RPC function that calculates total size
    const { data, error } = await supabase.rpc('user_storage_total', {
      p_user_id: userId,
    });

    if (error) throw error;
    return data || 0;
  } catch (err) {
    console.error('get storage total error:', err);
    return 0;
  }
};

export const checkStorageQuota = async (userId, fileSizeBytes) => {
  try {
    const currentUsage = await getUserStorageTotal(userId);
    const totalAfterUpload = currentUsage + fileSizeBytes;
    const quotaBytes = DEFAULT_QUOTA_BYTES;

    if (totalAfterUpload > quotaBytes) {
      return {
        allowed: false,
        currentUsage,
        quotaBytes,
        exceededBy: totalAfterUpload - quotaBytes,
      };
    }

    return {
      allowed: true,
      currentUsage,
      quotaBytes,
      exceededBy: 0,
    };
  } catch (err) {
    console.error('quota check error:', err);
    return {
      allowed: false,
      error: err.message,
    };
  }
};

// upload file with quota check - no cap this validates everything
export const uploadFile = async (userId, file) => {
  try {
    // check quota first - gotta be smart about this
    const quotaCheck = await checkStorageQuota(userId, file.size);
    if (!quotaCheck.allowed) {
      return {
        success: false,
        error: `quota exceeded by ${(quotaCheck.exceededBy / 1024 / 1024).toFixed(2)} MB`,
        quotaCheck,
      };
    }

    // generate unique upload path - user_id/uuid-filename
    // this prevents collisions and keeps things organized
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadPath = `${userId}/${generateId()}-${filename}`;

    // upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(uploadPath, file);

    if (uploadError) throw uploadError;

    // create metadata entry in database - gotta track everything
    const { data: metaData, error: metaError } = await supabase
      .from('user_files')
      .insert({
        user_id: userId,
        filename: file.name,
        size_bytes: file.size,
        storage_path: uploadPath,
        mime_type: file.type,
      })
      .select()
      .single();

    if (metaError) throw metaError;

    return {
      success: true,
      file: metaData,
      uploadData,
    };
  } catch (err) {
    console.error('upload error:', err);
    return {
      success: false,
      error: err.message,
    };
  }
};

// list user files - get all uploaded files with metadata
export const listUserFiles = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { files: data || [], error: null };
  } catch (err) {
    console.error('list files error:', err);
    return { files: [], error: err.message };
  }
};

// delete file - remove from storage and database
// no cap need to do both or things get messy
export const deleteFile = async (userId, fileId, storagePath) => {
  try {
    // delete from storage first
    const { error: storageError } = await supabase.storage
      .from('user-files')
      .remove([storagePath]);

    if (storageError) throw storageError;

    // delete from database
    const { error: dbError } = await supabase
      .from('user_files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', userId);

    if (dbError) throw dbError;

    return { success: true, error: null };
  } catch (err) {
    console.error('delete file error:', err);
    return { success: false, error: err.message };
  }
};

// get download url - temporary signed url for private files
export const getFileDownloadUrl = async (storagePath) => {
  try {
    const { data, error } = await supabase.storage
      .from('user-files')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry - reasonable fr

    if (error) throw error;
    return { url: data.signedUrl, error: null };
  } catch (err) {
    console.error('get download url error:', err);
    return { url: null, error: err.message };
  }
};

// admin reset - nuke all files for current user
// only callable by admin or in dev mode - gotta be careful here
export const adminResetUserStorage = async (userId) => {
  try {
    // get all user files to delete from storage
    const { data: files, error: fetchError } = await supabase
      .from('user_files')
      .select('storage_path')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    // delete all from storage - batch operation
    if (files && files.length > 0) {
      const paths = files.map((f) => f.storage_path);
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove(paths);

      if (storageError) throw storageError;
    }

    // delete all metadata
    const { error: dbError } = await supabase
      .from('user_files')
      .delete()
      .eq('user_id', userId);

    if (dbError) throw dbError;

    return { success: true, error: null };
  } catch (err) {
    console.error('admin reset error:', err);
    return { success: false, error: err.message };
  }
};
