import React from 'react';
import { StyleSheet,
     TouchableHighlight,
      View, 
      TouchableOpacity, 
      Text,
    Image,
    } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Badge } from 'react-native-paper';
import Colors from '../constants/Colors';


const ChatBar = ({ username, avatarUrl, lastMessage, onPress }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.outContainer} onPress={onPress}>
            <View style={styles.chatbar}>
                <Avatar.Image size={60} source={{ uri: avatarUrl }} />
                <View style={{ marginHorizontal: 12, paddingTop: 8 }}>
                    
                    <Text style={styles.profileNameText}>{username}</Text>
                    {lastMessage ? (
                        <Text style={styles.lastMessage}>
                            {lastMessage.length > 20 ? lastMessage.slice(0, 30) + '...' : lastMessage}
                        </Text>
                    ) : (
                        <Text style={styles.lastMessage}>No messages yet</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chatbar:{
        flexDirection:'row',
        width: "100%",
        alignContent:'center',
       
    },
    profileNameText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.primary_color
    },
    lastMessage: {
        fontSize: 14,
        color: '#3e3f3f',
        fontWeight:'400'
    },
    outContainer: {
        justifyContent:'center',
        width: "99%",
        borderColor:'#e6e2e2',
        backgroundColor:Colors.background_color,
        height:80,
        borderWidth:0.3,
        padding:5
        
    }
})

export default ChatBar;
