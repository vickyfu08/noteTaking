import {StyleSheet, Text, View} from 'react-native';

interface NoteCardProps {
  note: Note;
}
const NoteCard: React.FC<NoteCardProps> = ({note}: NoteCardProps) => {
  return (
    <View key={note.key} style={styles.noteCardContainer}>
      <Text>Category: {note.category}</Text>
      <Text>Client: {note.client}</Text>
      <View>
        <Text numberOfLines={1}>Note: {note.text}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  noteCardContainer: {
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: '5%',
    margin: '5%',
  },
});
export {NoteCard};
