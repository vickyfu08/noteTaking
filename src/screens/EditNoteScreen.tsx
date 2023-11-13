import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  useColorScheme,
  TextInput,
  StyleSheet,
  Keyboard,
  InputAccessoryView,
  Dimensions,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import uuid from 'react-native-uuid';
import {createOrSaveNote, getNoteByKey} from '../services/noteService';
import {useNavigation} from '@react-navigation/native';

interface EditNoteScreenProps {
  route: {
    params: {key: string};
  };
}
const options = require('../../assets/client-category.json');

const EditNoteScreen: React.FC<EditNoteScreenProps> = (
  props: EditNoteScreenProps,
) => {
  const {route} = props;
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === 'dark';

  const [key, _] = useState<string | null>(route?.params?.key ?? null);
  const [selectCategory, setSelectCategory] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState(options.category);
  const [openCategory, setOpenCategory] = useState(false);

  const [clientOptions, setClientOptions] = useState(options.client);
  const [selectClient, setSelectClient] = useState<string | null>(null);
  const [openClient, setOpenClient] = useState(false);

  const [input, setInput] = useState<string>('');

  useEffect(() => {
    const getNote = async (key: string) => {
      const res = await getNoteByKey(key);
      if (res) {
        const note = JSON.parse(res) as Note;
        setSelectCategory(note.category);
        setSelectClient(note.client);
        setInput(note.text);
      }
    };
    key && getNote(key);
  }, []);

  const onSubmit = async () => {
    const note: Note = {
      key: key ?? uuid.v4().toString(),
      category: selectCategory ?? '',
      client: selectClient ?? '',
      text: input,
      updatedAt: new Date().toISOString(),
    };
    await createOrSaveNote(note);
    navigation.navigate('Notes');
  };

  return (
    <>
      <SafeAreaView style={{backgroundColor: 'white', flex: 0}} />
      <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            height: '100%',
            padding: '5%',
          }}>
          <View style={{marginVertical: '2%', zIndex: 3}}>
            <Text>Category:</Text>
            <DropDownPicker
              open={openCategory}
              value={selectCategory}
              items={categoryOptions}
              setOpen={setOpenCategory}
              setValue={setSelectCategory}
              setItems={setCategoryOptions}
              placeholder="Select category"
            />
          </View>
          <View style={{marginVertical: '2%', zIndex: 2}}>
            <Text>Client:</Text>
            <DropDownPicker
              open={openClient}
              value={selectClient}
              items={clientOptions}
              setOpen={setOpenClient}
              setValue={setSelectClient}
              setItems={setClientOptions}
              placeholder="Select client"
            />
          </View>

          <View style={{marginVertical: '2%'}}>
            <Text>Note:</Text>

            <TextInput
              inputAccessoryViewID="Note"
              value={input}
              onChangeText={text => setInput(text)}
              multiline
              numberOfLines={10}
              style={{
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 5,
                padding: 5,
                height: 100,
              }}
              placeholder="Please enter your note here"></TextInput>
            <InputAccessoryView nativeID="Note">
              <TouchableOpacity
                onPress={() => Keyboard.dismiss()}
                style={styles.accessory}>
                <Text>DONE</Text>
              </TouchableOpacity>
            </InputAccessoryView>
          </View>
          <View style={{marginVertical: '10%'}}>
            <TouchableOpacity
              onPress={() => onSubmit()}
              style={styles.btnContainer}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
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
  },
  accessory: {
    width: Dimensions.get('window').width,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
  },
});

export default EditNoteScreen;
