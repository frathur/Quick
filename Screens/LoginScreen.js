import React from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import CustomButton from '../Components/CustomButton';
import { useUserStore } from '../store/UserDataStore';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import Colors from '../constants/Colors';
import { firebaseConfig } from '../Configs/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setLoggedInUser, setUserState, loggedInUser } = useUserStore();
    const [isLoading, setLoading] = useState(false);

    const handleSignIn = () => {
        const storeDataJson = async (key, value) => {
            try {
                const jsonValue = JSON.stringify(value);
                await AsyncStorage.setItem(key, jsonValue);
            } catch (e) {
                console.error("Error saving data", e);
            }
        };

        const storeData = async (key, value) => {
            try {
                await AsyncStorage.setItem(key, value);
            } catch (e) {
                console.error("Error saving data", e);
            }
        };

        try {
            setLoading(true);
            signInWithEmailAndPassword(auth, email, password)
                .then((res) => {
                    setLoggedInUser(email);
                    setLoading(false);
                    setUserState(true);
                })
                .catch((error) => {
                    setLoading(false);
                    console.error("Login error", error);
                    alert(`Login failed: ${error.message}`);
                });
        } catch (error) {
            setLoading(false);
            console.error("Unexpected error", error);
            alert(`Login failed: ${error.message}`);
        }

        setLoggedInUser(loggedInUser);
    };

    return (
        <View style={styles.container}>
            <Image style={styles.logoStyle} source={require('../assets/logo.png')} />
            <Text style={styles.title}>Sign In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor={Colors.secondaryTint}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor={Colors.secondaryTint}
            />
            <TouchableOpacity style={styles.forgotPassword} onPress={() => {/* Add forgot password logic */}}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            {isLoading && <ActivityIndicator size="large" color={Colors.primary} />}
            <CustomButton title="Sign In" primary={true} onPress={handleSignIn} />
            <TouchableOpacity style={styles.signUp} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: Colors.background_color,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.primary, // Updated title color
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
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: Colors.primary, // Updated text color
    },
    signUp: {
        marginTop: 20,
        alignItems: 'center',
    },
    signUpText: {
        color: Colors.secondaryTint, // Updated text color
    },
    logoStyle: {
        height: 100,
        width: 120,
        alignSelf: 'center',
        marginBottom: 20, // Adjusted margin for better spacing
    },
});

export default LoginScreen;
