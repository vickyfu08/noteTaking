import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  useColorScheme,
  StyleSheet,
  Alert,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  deleteNoteByKey,
  getAllNoteKeys,
  getNotes,
} from '../services/noteService';
import {KeyValuePair} from '@react-native-async-storage/async-storage/lib/typescript/types';
import {NoteCard} from '../components/Cards';

const ViewNoteScreen: React.FC<{}> = ({}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const getNotesFromLocalStorage = async () => {
      const keys = await getAllNoteKeys();
      if (keys && keys?.length > 0) {
        const readonlyRes = await getNotes(keys);
        const value = (
          JSON.parse(JSON.stringify(readonlyRes)) as KeyValuePair[]
        ).map(noteKeyValue => JSON.parse(noteKeyValue[1] ?? '')) as Note[];
        value &&
          setNotes(
            value.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            ),
          );
      }
    };

    getNotesFromLocalStorage();
  }, [isFocused]);

  const renderItem = ({item: note}: {item: Note}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Edit', {key: note.key})}
      onLongPress={() => onDelete(note.key)}>
      <NoteCard note={note}></NoteCard>
    </TouchableOpacity>
  );
  const emptyList = useMemo(() => {
    return (
      <Text style={{textAlign: 'center', marginVertical: '5%'}}>
        You don't have any note
      </Text>
    );
  }, []);
  const onDelete = (key: string) => {
    const deleteNote = async (key: string) => {
      //Delete it from local storage
      const status = await deleteNoteByKey(key);
      // Delete it from state
      const temp = JSON.parse(JSON.stringify(notes)) as Note[];
      const toDeleteIndex = temp.findIndex(note => note.key === key);
      temp.splice(toDeleteIndex, 1);
      status === 'success' && setNotes(temp);
    };
    Alert.alert('Important', 'Do you want to delete the note?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteNote(key),
      },
    ]);
  };

  return (
    <>
      <SafeAreaView style={{backgroundColor: 'white', flex: 0}} />
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            height: '100%',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Edit')}
            style={styles.btnContainer}>
            <Text>Add Note</Text>
          </TouchableOpacity>
          <Text style={{marginHorizontal: '5%'}}>Long press to delete</Text>

          <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={note => note.key}
            ListEmptyComponent={emptyList}></FlatList>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  btnContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '5%',
  },
  noteCardContainer: {
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: '5%',
    margin: '5%',
  },
});
export default ViewNoteScreen;
