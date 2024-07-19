import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HomeScreen from './Tabs/HomeScreen';
import ExploreScreen from './Tabs/ExploreScreen';
import SettingsScreen from './Tabs/SettingsScreen';
import Colors from '../../constants/Colors';
// import ChannelScreen from './Tabs/ChannelScreen';
import { BaseChannelsScreen } from './Tabs/ChannelScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

const HomeBase = ({navigation}) => {
    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home-Screen') {
                            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-outline';
                        } else if (route.name === 'Explore') {
                            iconName = focused ? 'compass' : 'compass-outline';
                        } else if (route.name === 'Channels') {
                            iconName = focused ? 'people' : 'people-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={25} color={color} />;
                    },
                    tabBarActiveTintColor: Colors.primary_color,
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        backgroundColor: Colors.background_color,
                        height:50
                    },
                    headerStyle: {
                        backgroundColor: Colors.background_color,
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                })}
            >
                
                    
                {/* <Tab.Screen name="Contact"  options={{
                    headerTitleStyle: {
                        fontSize:28,
                        fontWeight:'bold'
                    }
                }}  component={ExploreScreen} /> */}
                <Tab.Screen name="Channels" options={{
                     headerTitleStyle: {
                        fontSize:28,
                        fontWeight:'bold'
                    }
                }}
                
                component={BaseChannelsScreen} />
                <Tab.Screen name="Home-Screen"   options={{ title: 'Chats', headerRight:() => (
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=> navigation.navigate('Copilot')} >
                        <MaterialCommunityIcons size={30} style={{paddingHorizontal:4}} color={Colors.primary_color} name='robot-vacuum' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> navigation.navigate("Find-User")}>
                        <Ionicons color={'gray'} style={{paddingHorizontal:15}} name='person-add-outline' size={25} ></Ionicons>
                    </TouchableOpacity>
                    </View>),
        
                    headerTitleStyle: {
                        fontSize:28,
                        fontWeight:'bold'
                    }
                 
                
                }} component={HomeScreen} />

                <Tab.Screen name="Settings" options={{
                    headerStyle:
                     {backgroundColor:Colors.background_color}}
                     
                     } component={SettingsScreen} />
                    
            </Tab.Navigator>
    );
};

const styles = StyleSheet.create({});

export default HomeBase;
