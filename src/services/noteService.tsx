import AsyncStorage from '@react-native-async-storage/async-storage';

const createOrSaveNote = async (note: Note) => {
  // Upsert note by id
  try {
    const noteValue = JSON.stringify(note);
    await AsyncStorage.setItem(note.key, noteValue);
  } catch (e) {
    console.log('Saving note error', e);
  }
};
const getAllNoteKeys = async () => {
  // Get all keys
  let keys;
  try {
    keys = await AsyncStorage.getAllKeys();
  } catch (e) {
    console.log('Read note id error', e);
  }
  return keys;
};
const getNotes = async (keys: readonly string[]) => {
  let notes;
  try {
    notes = await AsyncStorage.multiGet(keys);
  } catch (e) {
    console.log('Get notes error', e);
  }
  return notes;
};
const getNoteByKey = async (key: string) => {
  let note;
  try {
    note = await AsyncStorage.getItem(key);
  } catch (e) {
    console.log('Get note error', e);
  }
  return note;
};
const deleteNoteByKey = async (key: string) => {
  let status = '';
  try {
    await AsyncStorage.removeItem(key);
    status = 'success';
  } catch (e) {
    status = 'error';
    console.log('Delete note error', e);
  }
  return status;
};

export {
  createOrSaveNote,
  getAllNoteKeys,
  getNotes,
  getNoteByKey,
  deleteNoteByKey,
};
