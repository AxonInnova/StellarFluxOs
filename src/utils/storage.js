import localforage from 'localforage';

const STORAGE_KEYS = {
  WINDOWS: 'stellar_windows_state',
  TERMINAL_HISTORY: 'stellar_terminal_history',
  NOTEPAD_CONTENT: 'stellar_notepad_content',
  TERMINAL_OUTPUT: 'stellar_terminal_output',
};

// save window positions, sizes, z-index state
export const saveWindowState = async (windows) => {
  try {
    await localforage.setItem(STORAGE_KEYS.WINDOWS, windows);
  } catch (err) {
    console.error('error saving window state fr', err);
  }
};

export const loadWindowState = async () => {
  try {
    return await localforage.getItem(STORAGE_KEYS.WINDOWS);
  } catch (err) {
    console.error('error loading window state ngl', err);
    return null;
  }
};

// terminal history - keeps commands
export const saveTerminalHistory = async (history) => {
  try {
    await localforage.setItem(STORAGE_KEYS.TERMINAL_HISTORY, history);
  } catch (err) {
    console.error('terminal history save failed', err);
  }
};

export const loadTerminalHistory = async () => {
  try {
    return await localforage.getItem(STORAGE_KEYS.TERMINAL_HISTORY) || [];
  } catch (err) {
    console.error('terminal history load failed', err);
    return [];
  }
};

// terminal output buffer
export const saveTerminalOutput = async (output) => {
  try {
    await localforage.setItem(STORAGE_KEYS.TERMINAL_OUTPUT, output);
  } catch (err) {
    console.error('terminal output save failed', err);
  }
};

export const loadTerminalOutput = async () => {
  try {
    return await localforage.getItem(STORAGE_KEYS.TERMINAL_OUTPUT) || '';
  } catch (err) {
    console.error('terminal output load failed', err);
    return '';
  }
};

// notepad auto-save
export const saveNotepadContent = async (content) => {
  try {
    await localforage.setItem(STORAGE_KEYS.NOTEPAD_CONTENT, content);
  } catch (err) {
    console.error('notepad save failed', err);
  }
};

export const loadNotepadContent = async () => {
  try {
    return await localforage.getItem(STORAGE_KEYS.NOTEPAD_CONTENT) || '';
  } catch (err) {
    console.error('notepad load failed', err);
    return '';
  }
};

// nuke everything for reset
export const clearAllStorage = async () => {
  try {
    await localforage.clear();
    console.log('all storage cleared no cap');
  } catch (err) {
    console.error('clear storage failed', err);
  }
};
