import { useState, useEffect } from 'react';
import { listUserFiles, deleteFile, uploadFile, getUserStorageTotal, checkStorageQuota } from '../lib/storage';

export default function FileManager({ userId, onUpload }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 50 * 1024 * 1024 });

  // load files on mount
  useEffect(() => {
    loadFiles();
    loadStorageUsage();
  }, [userId]);

  const loadFiles = async () => {
    setLoading(true);
    const { files: userFiles, error: err } = await listUserFiles(userId);
    if (err) {
      setError(err);
    } else {
      setFiles(userFiles || []);
    }
    setLoading(false);
  };

  const loadStorageUsage = async () => {
    const used = await getUserStorageTotal(userId);
    setStorageUsage({ used, total: 50 * 1024 * 1024 });
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // check quota first
      const quotaCheck = await checkStorageQuota(userId, file.size);
      if (!quotaCheck.allowed) {
        setError(
          `quota exceeded: using ${formatBytes(quotaCheck.currentUsage)} of ${formatBytes(quotaCheck.quotaBytes)}`
        );
        setUploading(false);
        return;
      }

      // upload
      const result = await uploadFile(userId, file);
      if (result.success) {
        setFiles([result.file, ...files]);
        loadStorageUsage();
        onUpload?.(result.file);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (fileId, storagePath) => {
    if (!confirm('delete file? // no undo fr')) return;

    setLoading(true);
    const result = await deleteFile(userId, fileId, storagePath);
    if (result.success) {
      setFiles(files.filter((f) => f.id !== fileId));
      loadStorageUsage();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const percentUsed = (storageUsage.used / storageUsage.total) * 100;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="space-y-2 mb-4 border-b border-cyan-500/10 pb-4">
        {/* storage stats */}
        <div className="text-xs text-slate-500 font-mono">STORAGE USAGE</div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{formatBytes(storageUsage.used)}</span>
            <span>{formatBytes(storageUsage.total)}</span>
          </div>
          <div className="h-1.5 bg-slate-900/50 rounded border border-cyan-500/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500/60 to-blue-500/60 rounded transition-all"
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* error display */}
        {error && (
          <div className="text-xs text-red-400 font-mono bg-red-500/10 p-2 rounded border border-red-500/20">
            ✕ {error}
          </div>
        )}
      </div>

      {/* upload button */}
      <div className="mb-4">
        <label className="block">
          <div className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 rounded cursor-pointer transition text-center font-mono text-xs text-cyan-300">
            {uploading ? '⟳ uploading...' : '↑ UPLOAD FILE'}
          </div>
          <input
            type="file"
            onChange={handleFileSelect}
            disabled={uploading || loading}
            className="hidden"
          />
        </label>
      </div>

      {/* files list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <div className="text-xs text-slate-500 font-mono text-center py-4">loading files...</div>
        ) : files.length === 0 ? (
          <div className="text-xs text-slate-500 font-mono text-center py-4">// no files yet fr</div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="bg-slate-900/30 border border-cyan-500/10 rounded p-3 hover:bg-slate-900/50 transition"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-cyan-300 truncate">{file.filename}</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {formatBytes(file.size_bytes)}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(file.id, file.storage_path)}
                  disabled={loading}
                  className="text-xs font-mono text-red-400 hover:text-red-300 disabled:opacity-50 transition"
                  title="delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
