import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeBase from './Screens/Home/HomeBase';
import BaseScreen from './Screens/BaseScreen';
import RegisterScreen from './Screens/RegisterScreen';
import LoginScreen from './Screens/LoginScreen';
import ProfileScreen from './Screens/ProfileScreen';
import FindChats from './Screens/Home/FindChats';
import ChatDetails from './Screens/Home/ChatDetails';
import VoiceCallScreen from './Screens/Home/VoiceCallScreen';
import VideoCallScreen from './Screens/Home/VideoCallScreen';
import { useUserStore } from './store/UserDataStore';
import Colors from './constants/Colors';
import ChannelDetails from './Screens/Home/ChannelDetails';
import CreateChannelScreen from './Screens/Home/CreateChannelScreen';
import CopilotPage from './Screens/Home/CopilotPage';
import StudioScreen from './Screens/Home/StudioScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { isLoggedIn, setUserState } = useUserStore()
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: Colors.background_color }
      }}>
        {isLoggedIn ? (
          <Stack.Group   name='Home-Decendants'>
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeBase} />
            <Stack.Screen name='Chat-Details' options={{ headerShown: true, title:'' }} component={ChatDetails} />
            <Stack.Screen name='Channel-Details' options={{ headerShown: true, title:'' }}  component={ChannelDetails} />
            <Stack.Screen name='Create-Channel' options={{title:'Create A Channel', headerTitleStyle: {
              fontWeight:'500'
            }}} component={CreateChannelScreen} />
            <Stack.Screen name='Copilot' options={{title:'Cloud Copilot'}} component={CopilotPage} />
            <Stack.Screen name='Video-Call' options={{headerShown:false}} component={VideoCallScreen} />
            <Stack.Screen name='Voice-Call' options={{headerShown:false}}  component={VoiceCallScreen} />
            <Stack.Screen name='Studio' component={StudioScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group
            name='before-login'
            screenOptions={{ headerShown: false}}
            
          >
            <Stack.Screen name="Get-Started" component={BaseScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>
        )}
        <Stack.Screen
          name="Find-User"
          options={{
            headerShown: true,
            title: 'Search Users',
            headerStyle: {
              height: 56,
              backgroundColor: Colors.background_color 
            },
            headerTitleStyle: {
              fontSize: 16, // Adjust the font size as needed
            },
          }}
          component={FindChats}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
