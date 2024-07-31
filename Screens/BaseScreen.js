import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Colors from '../constants/Colors';
import CustomButton from '../Components/CustomButton';

const BaseScreen = ({ navigation }) => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.logoContainer}>
                <Image style={styles.imageStyle} source={require('../assets/logo.png')} />
                <Text style={styles.titleStyle}>Welcome to QuickTalk</Text>
                <Text style={styles.metaText}>Your premier chat application.</Text>
                <Text style={styles.metaText}>The hub for all the groups in your life.</Text>
            </View>
            <View style={styles.welcomeImageContainer}>
                <Image style={styles.welcomeImageStyle} source={require('../assets/welcome.png')} />
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton title='Sign In' primary='true' onPress={() => navigation.navigate('Login')} />
                <CustomButton title='Create An Account' secondary='true' onPress={() => navigation.navigate('Register')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background_color,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
    },
    imageStyle: {
        width: 'auto',
        height: 'auto',
    },
    titleStyle: {
        fontWeight: 'medium',
        fontSize: 25,
        color: Colors.primary, // Added color for title
    },
    metaText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '200',
        color: Colors.metaTextColor, // Use the color from the Colors object
    },
    welcomeImageContainer: {
        marginTop: 12,
        alignItems: 'center',
    },
    welcomeImageStyle: {
        height: 300,
        width: 200,
    },
    buttonContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BaseScreen;
