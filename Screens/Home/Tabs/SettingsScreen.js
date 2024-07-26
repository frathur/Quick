import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package
import Colors from '../../../constants/Colors';
import { useUserStore } from '../../../store/UserDataStore';
import { firebaseConfig } from '../../../Configs/firebase';
import { getFirestore, getDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


import { initializeApp } from 'firebase/app';
import { Avatar } from 'react-native-paper';

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const SettingsScreen = ({ navigation }) => {
    const {setUserState, setLoggedInUser, loggedInUser} = useUserStore()
    const [userData, setUserData]= useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [newUsername, setNewUsername] = useState(userData?.username);
    const [newPhone, setNewPhone] = useState(userData?.phone);
    const [newBio, setNewBio] = useState(userData?.bio);
    const [newBirthDay, setBirthDay] = useState('')

    const updateProfile = async () => {
        const userRef = doc(db, 'users', loggedInUser);
        await updateDoc(userRef, {
            username: newUsername,
            phone: newPhone,
            bio: newBio,
            birthday: newBirthDay
        });
        setModalVisible(false);
    };
    
    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: 'Profile',
        headerTitleStyle: {
          fontSize: 28,
          fontWeight:'bold'
        },
        headerRight: () => (
          <TouchableOpacity>
            <Ionicons name="qr-code-outline" size={25} style={{ paddingHorizontal: 30 }} color={Colors.primary} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: Colors.background_color, // Replace with your desired header background color
        },
      });
    }, [navigation]);

    const pickImage = async () => {
        console.log(userData)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
    
        if (!result.canceled) {
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            if( result.assets[0].type == 'image') {
                const storage = getStorage();
                const storageRef = ref(storage, `avatars/${Date.now()}`);
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);
                alert('Image uploaded');
                setUserData( {"bio": "Hey there I am on cloud Chat", "contacts": [], "email": "far@gmail.com", "phone": "", "profileUrl":downloadURL, "status": "online", "username": "far"})
                const userRef = doc(db, 'users', userData?.email);
                await updateDoc(userRef, {
                    profileUrl: downloadURL
                });                
            }
    
        }
    };
    
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'users', loggedInUser), (doc) => {
            if (doc.exists()) {
                setUserData(doc.data());
            } else {
                console.log('User document does not exist');
            }
        }, (error) => {
            console.error('Error fetching user data:', error);
        });
    
        return unsubscribe;
    }, [loggedInUser]);

    const handleLogOut = () => {
        setUserState(false)
        setLoggedInUser(null)
    }
    return (
            <ScrollView style={styles.container}>
                <View style={styles.profilePicContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        <Avatar.Image size={100} source={{ uri: userData?.profileUrl }} />
                    </TouchableOpacity>
                    <Text style={styles.username}>@ {userData?.username}</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.option}>
                    <Ionicons name="mail-outline" size={24} color="black" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionName}>Email</Text>
                        <Text style={styles.optionValue}>{userData?.email}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.option}>
                    <Ionicons name="call-outline" size={24} color="black" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionName}>Phone</Text>
                        <Text style={styles.optionValue}>{userData?.phone}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.option}>
                    <Ionicons name="gift-outline" size={24} color="black" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionName}>Add birthday</Text>
                        <Text style={styles.optionValue}>{userData?.birthday}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.option}>
                    <Ionicons name="rose-outline" size={24} color="black" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionName}>Bio</Text>
                        <Text style={styles.optionValue}>{userData?.bio}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Other</Text>
                </View>
                <TouchableOpacity style={styles.option}>
                    <Ionicons name="share-outline" size={24} color="black" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionName}>Share Profile</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Studio")} style={styles.option}>
                    <Ionicons name="stats-chart-outline" size={24} color="black" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionName}>Channel Manager</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogOut} style={styles.option}>
                    <Ionicons name='log-out-outline' size={24} color="black" />
                    <View style={styles.optionTextContainer}>
                        <Text style={[styles.optionName, { color: 'red' }]}>Log Out</Text>
                    </View>
                </TouchableOpacity>
                <Modal animationType='slide' visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                        <Ionicons name='close-circle-outline' color={'#ce6161'} size={40} />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Text style={styles.text}>Username</Text>
                        <TextInput onChangeText={(e) => setNewUsername(e)} placeholder={userData?.username} style={styles.input} />
                        <Text style={styles.text}>Phone</Text>
                        <TextInput onChangeText={(e) => setNewPhone(e)} placeholder='Phone Number' style={styles.input} />
                        <Text style={styles.text}>Birth Day</Text>
                        <TextInput placeholder='dd/mm/yyyy' onChangeText={(e) => setBirthDay(e)} style={styles.input} />
                        <Text style={styles.text}>Bio</Text>
                        <TextInput onChangeText={(e) => setNewBio(e)} placeholder={userData?.bio} style={styles.input} />
                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity onPress={() => { updateProfile(); setModalVisible(false); }}>
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor:Colors.background_color
    },
    text: {color:'grey', fontSize:12, padding:8},
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    
    modalSytle: {
        padding:10,
    },
    modalContent: {
        marginTop:30,
        paddingHorizontal:8,
    
    }
    ,
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'white', // Set your desired profile picture color
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
        fontSize:1
    },
});

export default SettingsScreen;
