import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Checkbox from 'react-native-paper';
import CustomButton from '../Components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useUserStore } from '../store/UserDataStore';
import { firebaseConfig } from '../Configs/firebase';

firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageBlob, setImageBlob] = useState(null);
    const [localImageUrl, setLocalUrl] = useState(null);
    const [checked, setChecked] = useState(false);
    const { setUserState, setLoggedInUser } = useUserStore();

    const handleCreateAccount = async () => {
        setIsLoading(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Prepare user data for Firestore
            const userData = {
                username: username,
                email: email,
                bio: 'welcome to quick talkr',
                contacts: [],
                status: 'online',
                phone: '',
                birthday: ''
            };

            // Store user data in Firestore
            await setDoc(doc(db, "users", user.email), userData);
            alert('User Created');
            setUserState(true);
            setLoggedInUser(user.email);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SafeAreaView style={styles.mainContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Get-Started')}>
                    <Ionicons name='chevron-back' size={20} />
                </TouchableOpacity>
                <View style={styles.welcomeImageContainer}>
                    <Image style={styles.welcomeImageStyle} source={require('../assets/Shield.png')} />
                </View>
                <View style={styles.form}>
                    <TextInput
                        autoCapitalize='none'
                        onChangeText={(text) => setUsername(text)}
                        style={styles.input}
                        placeholder='@Username'
                    />
                    <TextInput
                        autoCapitalize='none'
                        onChangeText={(text) => setEmail(text)}
                        style={styles.input}
                        placeholder='Email Address'
                    />
                    <TextInput
                        autoCapitalize='none'
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                        style={styles.input}
                        placeholder='Password'
                    />
                    <View style={styles.checkboxContainer}>
                        <Text style={styles.checkboxLabel}></Text>
                    </View>
                </View>
                {isLoading && <ActivityIndicator size={30} />}
                <CustomButton title='Create Account' primary='true' onPress={handleCreateAccount} />
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text>Already Have An Account? Sign In</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.background_color
    },
    backButton: {
        alignSelf: 'flex-start',
        marginTop: 60,
        marginLeft: 15
    },
    input: {
        height: 50,
        borderColor: Colors.primaryTint,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    form: {
        marginTop: -5,
        backgroundColor: Colors.background_color,
        width: "80%"
    },
    welcomeImageContainer: {
        marginTop: 12,
        alignItems: 'center'
    },
    welcomeImageStyle: {
        height: 130,
        width: 200,
        marginLeft: 100,
        marginBottom: 5,
        marginTop: -10
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: "center"
    },
    checkboxLabel: {
        fontSize: 12,
        paddingVertical: 16,
        fontWeight: '100'
    },
})

export default RegisterScreen;
