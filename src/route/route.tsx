import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EditNoteScreen from '../screens/EditNoteScreen';
import ViewNoteScreen from '../screens/ViewNoteScreen';
const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Notes" component={ViewNoteScreen} />
        <Stack.Screen name="Edit" component={EditNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Routes;
