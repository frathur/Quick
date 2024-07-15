import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package
import Colors from '../constants/Colors';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../Configs/firebase';
import { getFirestore } from 'firebase/firestore';
import { arrayUnion, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { Avatar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

firebase.initializeApp(firebaseConfig)




const ProfileScreen = ({ navigation, route }) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const userRef = doc(db, 'users', route.params.username);
    
        // Set up the onSnapshot listener
        const unsub = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data) {
             setUser(data)
            } else {
              console.log('Messages field is missing in the document');
            }
          } else {
            alert("Can't Load Chats");
          }
    })}, [navigation])

    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: '',
        headerTitleStyle: {
          fontWeight:'bold'
        },
        headerRight: () => (
          <TouchableOpacity>
            <Ionicons name='qr-code-outline' size={25} style={{ paddingHorizontal: 10 }} color={Colors.primary} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: Colors.background_color, // Replace with your desired header background color
        },
      });
    }, [navigation]);
    

    return (
        <View style={styles.container}>
            <View style={styles.profilePicContainer}>
                <Avatar.Image source={{uri:user?.profileUrl}} size={120} />
                <Text style={{fontSize:30, fontWeight:'bold'}}>{user?.username}</Text>
            </View>
            <View style={[styles.option, styles.alignItemsCenter]}>
                <Ionicons name="mail-outline" size={24} color="black" />
                <Text style={styles.optionName}>Email</Text>
                <Text style={styles.optionValue}>{user?.email}</Text>
            </View>
            <View style={[styles.option, styles.alignItemsCenter]}>
                <Ionicons name="call-outline" size={24} color="black"  />
                <Text style={styles.optionName}>Phone</Text>
                <Text style={styles.optionValue}>
                  {user?.phone.length==0? 'No Contact':user?.phone}
                  </Text>
            </View>

            <View style={[styles.option, styles.alignItemsCenter]}>
                <Ionicons name="gift-outline" size={24} color="black" />
                <Text style={styles.optionName}>Add birthday</Text>
                <Text style={styles.optionValue}>
                {user?.birthday?.length==0? 'No Contact':user?.birthday}
                </Text>

            </View>
            <View style={[styles.option, styles.alignItemsCenter]}>
                <Ionicons name="rose-outline" size={24} color="black" />
                <Text style={styles.optionName}>Bio</Text>
                <Text style={styles.optionValue}>
                  {user?.bio}
                </Text>

            </View>

            <View style={{marginTop:40}}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>Other</Text>

                <TouchableOpacity style={[styles.option, styles.alignItemsCenter]}>
                    <Ionicons name='chatbox-ellipses-outline' size={24} color="black"  />
                    <Text style={styles.optionName}>Help & Feedback</Text>
                </TouchableOpacity>

               

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor:Colors.background_color
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'purple', // Set your desired profile picture color
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth:1,
        paddingVertical: 10,
    },
    alignItemsCenter: {
        alignItems: 'center',
    },
    optionName: {
        flex: 1,
        marginHorizontal: 10,
    },
    optionValue: {
        flex: 1,
        textAlign: 'right',
        color:'#555555',
        fontSize:14
    },
});

export default ProfileScreen;
