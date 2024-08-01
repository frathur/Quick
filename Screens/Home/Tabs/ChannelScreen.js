import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AccountBar from '../../../Components/AccountBar';
import ChannelBar from '../../../Components/ChannelBar';
import { firebaseConfig } from '../../../Configs/firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useUserStore } from '../../../store/UserDataStore';
import Colors from '../../../constants/Colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {Snackbar} from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

//All Channels To display
function AllChannelsScreen() {
    const [searchQuery, setSearchQuery] = useState('')
    const [allChannels, setAllChannels] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filteredChannels, setFilteredChannels] = useState([])
    const { loggedInUser } = useUserStore()
    const [visible, setVisible] = React.useState(false);
    const [currentName, setCurrentName] = useState('')

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

    const navigation = useNavigation();

    const handleSearch = (text) => {
        setSearchQuery(text);
        filterChannels(text);
    }

    const filterChannels = (query) => {
        if (query.trim() === '') {
            setFilteredChannels(allChannels);
        } else {
            const filtered = allChannels.filter((channel) =>
                channel.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredChannels(filtered);
        }
    }

    const handleFollow = async (id, name) => {
        const chatRef = doc(db, 'channels', id);
        setCurrentName(name)
        try {
            await updateDoc(chatRef, {
                followers: arrayUnion(loggedInUser), // Add new message to the array
            });
        } catch (e) {
            console.log('Error', e)
            console.log(chatRef)
        }
        onToggleSnackBar()
    }

    const handleUnFollow = async (id, name) => {
        const chatRef = doc(db, 'channels', id);

        try {
            await updateDoc(chatRef, {
                followers: arrayRemove(loggedInUser), // Add new message to the array
            });
        } catch (e) {
            console.log('Error', e)
            console.log(chatRef)
        }
    }

    const handleFabPress = () => {
        navigation.navigate('Create-Channel');
    };

    useEffect(() => {
        setIsLoading(true)
        const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
            const channels = [];
            snapshot.docs.forEach((doc) => {
                channels.push(doc.data());
            });
            setAllChannels(channels);
            setFilteredChannels(channels);
            setIsLoading(false)
        });
        return () => unsub();
    }, []);


    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search"
                onChangeText={handleSearch}
                value={searchQuery}
                style={{
                    marginHorizontal: 3,
                    marginVertical: 8,
                    backgroundColor: '#e8f3f5',
                    height: 50,
                    marginLeft:15,
                    width:330,
                }}
                cursorColor={Colors.primary_color}
            />
            <View>
                
            </View>
            {filteredChannels.length === 0 && <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '200' }}>No Channels Found</Text>}

            {!isLoading ? (
                <FlatList
                    data={filteredChannels}
                    keyExtractor={(item) => item.channelId}
                    contentContainerStyle={styles.flatListContainer}
                    renderItem={({ item }) => (
                        <ChannelBar item={item} unfollowPressed={()=> handleUnFollow(item.channelId,item.name )}  followPressed={() => handleFollow(item.channelId, item.name)} onPress={() => navigation.navigate('Channel-Details', { item: item, id: item.channelId })} />
                    )}
                />
            ) : (
                <ActivityIndicator size={20} color={Colors.primary_color} />
            )}

            <FAB
                style={styles.fab}
                onPress={handleFabPress}
                color="white"
                icon={'account-multiple-plus'}
            />
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                style={{color:Colors.primary_color}}
                rippleColor={Colors.primary_color}
                action={{
                label: 'Okay',
                onPress: () => {
                    setCurrentName('')
                },
                labelStyle:{color:Colors.primary_color}
                }}>
                {`Following  "${currentName} "`}
            </Snackbar>
        </View>
    );
}

function BaseChannelsScreen(){
    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor: Colors.background_color,
                shadowColor:Colors.primary_color,
                borderBottomColor:Colors.primary_color
            }
        }} initialRouteName='Following'  style={{borderColor:Colors.background_color}} >
          <Tab.Screen  name="Following"   component={FollowingChannelsScreen} />
          <Tab.Screen name="All Channels" component={AllChannelsScreen} />
        </Tab.Navigator>
      );

}

const FollowingChannelsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [allChannels, setAllChannels] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filteredChannels, setFilteredChannels] = useState([])
    const { loggedInUser } = useUserStore()
    const [visible, setVisible] = React.useState(false);
    const [currentName, setCurrentName] = useState('')

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const navigation = useNavigation();

    const handleSearch = (text) => {
        setSearchQuery(text);
        filterChannels(text);
    }

    const filterChannels = (query) => {
        if (query.trim() === '') {
            setFilteredChannels(allChannels);
        } else {
            const filtered = allChannels.filter((channel) =>
                channel.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredChannels(filtered);
        }
    }

    const handleFollow = async (id, name) => {
        const chatRef = doc(db, 'channels', id);

        try {
            await updateDoc(chatRef, {
                followers: arrayUnion(loggedInUser), // Add new message to the array
            });
        } catch (e) {
            console.log('Error', e)
            console.log(chatRef)
        }
    }
    const handleUnFollow = async (id, name) => {
        const chatRef = doc(db, 'channels', id);

        try {
            await updateDoc(chatRef, {
                followers: arrayRemove(loggedInUser), // Add new message to the array
            });
        } catch (e) {
            console.log('Error', e)
            console.log(chatRef)
        }
        setCurrentName(name)
        onToggleSnackBar()

        
    }

    const handleFabPress = () => {
        navigation.navigate('Create-Channel');
    };

    useEffect(() => {
        setIsLoading(true)
        const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
            const channels = [];
            snapshot.docs.forEach((doc) => {
                doc.data().followers.includes(loggedInUser) ? channels.push(doc.data()):
                null
            });
            setAllChannels(channels);
            setFilteredChannels(channels);
            setIsLoading(false)
        });
        return () => unsub();
    }, []);


    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search"
                onChangeText={handleSearch}
                value={searchQuery}
                style={{
                    marginHorizontal: 3,
                    marginVertical: 8,
                    backgroundColor: '#e8f3f5',
                    height: 50,
                    marginLeft:15,
                    width:330,
                }}
                cursorColor={Colors.primary_color}
            />
            <View>
                
            </View>
            {filteredChannels.length === 0 && <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: '200' }}>No Channels Found</Text>}

            {!isLoading ? (
                <FlatList
                    data={filteredChannels}
                    keyExtractor={(item) => item.channelId}
                    contentContainerStyle={styles.flatListContainer}
                    renderItem={({ item }) => (
                        <ChannelBar item={item} unfollowPressed={() => handleUnFollow(item.channelId, item.name)} followPressed={() => handleFollow(item.channelId, item.name)} onPress={() => navigation.navigate('Channel-Details', { item: item, id: item.channelId })} />
                    )}
                />
            ) : (
                <ActivityIndicator size={20} color={Colors.primary_color} />
            )}

            <FAB
                style={styles.fab}
                onPress={handleFabPress}
                color="white"
                icon={'account-multiple-plus'}
            />
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                style={{color:Colors.primary_color, borderCurve:2}}
                rippleColor={Colors.primary_color}
                action={{
                label: 'Okay',
                onPress: () => {
                    setCurrentName('')
                },
                labelStyle:{color:Colors.primary_color}
                }}>
                {`Unfollowed  "${currentName} "`}
            </Snackbar>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_color,
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
 
  fab: {
    position: 'absolute',
    margin: 10,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary_color,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 20,
  },
});

export {BaseChannelsScreen}
