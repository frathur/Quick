import React from 'react';
import { StyleSheet, View, Text, Image} from 'react-native';
import Colors from '../constants/Colors';
import CustomButton from '../Components/CustomButton';
import { useState } from 'react';
const BaseScreen = ({navigation}) => {
    return (
        <View style={styles.mainContainer}>
           <View style={styles.logoContainer}>
                <Image style={styles.imageStyle}  source={require('../assets/logo.png')} />
                <Text style={styles.titleStyle}>Welcome to cloudChat</Text>
                <Text style={styles.metaText}>Share with anyone, anywhere.</Text>
                <Text style={styles.metaText} >A home for all  the groups in your life</Text>
           </View>
           <View style={styles.welcomeImageContainer}>
                <Image  style={styles.welcomImageStyle} source={require('../assets/welcom.png')} ></Image>
           </View>
           <View style={styles.buttonContainer}>
            <CustomButton title='Sign In' primary='true' onPress={()=> navigation.navigate('Login')} ></CustomButton>
            <CustomButton title='Create An Account' secondary='true' onPress={()=> navigation.navigate('Register')}  ></CustomButton>
           </View>
           

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor: Colors.background_color
    },
    logoContainer:{
        justifyContent:'center',
        alignItems:'center',
        marginTop: 70
    },
    imageStyle:{
        width:100,
        height:100
    },
    titleStyle:{
        fontWeight:'medium',
        fontSize: 25
    },
    metaText:{
        textAlign:'center',
        fontSize:16,
        fontWeight:'200'
    },
    welcomeImageContainer:{
        marginTop: 12,
        alignItems:'center'
    },
    welcomImageStyle: {
        height:300,
        width: 200
    },
    buttonContainer:{
        marginTop:20,
        justifyContent:'center',
        alignItems:'center',
    
    }
})

export default BaseScreen;
