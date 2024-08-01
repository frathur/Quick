import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/Colors';
import { Avatar } from 'react-native-paper';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../../Configs/firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore, SnapshotMetadata } from 'firebase/firestore';
import { arrayUnion, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useUserStore } from '../../store/UserDataStore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { HUGG_API } from '../../Configs/huggingface';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const myKey = 'AIzaSyDG8nnWA8iqI44zas9uVbhZqz1WwW-SbcU'


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(myKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

firebase.initializeApp(firebaseConfig)

const CopilotPage = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const flatListRef = useRef(null);
  const { loggedInUser } = useUserStore()
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} style={{ paddingTop: 5, margin: 4 }} />
          <TouchableOpacity style={{ paddingHorizontal: 5 }} >
            <Avatar.Image size={45} source={require('../../assets/ai.jpg')} />
          </TouchableOpacity>
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: Colors.text_color,
        fontWeight: '200',
        fontSize:18,
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Ionicons style={{ padding: 3, marginHorizontal: 3 }} size={18} name='ellipsis-vertical'></Ionicons>
          </TouchableOpacity>
        </View>
      )
    });
  }, [])

  useEffect(()=> {

    const fetchOrCreate = async () => {
      const docRef = doc(db, "copilot", loggedInUser);
      const unsub = onSnapshot(docRef, async(snapshot)=> {
          if (snapshot.exists()) {
              setMessages(snapshot.data()?.messages)
          }else {
            await setDoc(doc(db, "copilot", loggedInUser), {
              createdAt:new Date().toUTCString(),
              messages:[]
            });
          }
      })
    
    }
    fetchOrCreate()
  }, [])
  
  async function run(query) {
    const prompt = `You are called cloud chat copilot, you are an assitant chatbot for the cloudchat app, answer this question. Question: ${query}`
  
    const result = await model.generateContent(prompt, { max_tokens: 30 });
    const response = await result.response;
    const text = response.text();
    const newMessageObj = {
      sender:'AI',
      message: text
    }
    setMessages(prev => [...prev, newMessageObj])
    updateChat(newMessageObj)


  }
  

  const handleSendMessage = async () => {
    let newMessageObj;
    if (newMessage.trim() !== '' ) {
         newMessageObj = {
        sender: loggedInUser,
        message: newMessage,
        
        
      };
      setMessages(prev => [...prev, newMessageObj])
      run(newMessage)
      setNewMessage('');
      updateChat(newMessageObj)

      
    }
    
  };
  const updateChat = async (data) => {
    try {
      const docRef = doc(db, 'copilot', loggedInUser);
      await updateDoc(docRef, {
        messages: arrayUnion(data)
      }
      );
      console.log('Chat data updated successfully!');
    } catch (error) {
      console.error('Error updating chat data:', error);
    }
  };


  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === loggedInUser ? styles.sentMessage : styles.receivedMessage]}>
      {item.imageUrl && 
      <Image  source={{ uri: item.imageUrl }} style={styles.attachedImage} />
      
      }
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={{alignSelf:'flex-end', color:'white', fontSize:10}}>{item.sentTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/back.jpg')} style={styles.backgroundImage} >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.ChatId}
          contentContainerStyle={[styles.messageList]}
        />
      </ImageBackground>
      <View style={styles.inputContainer}>
        {attachedImage && (
          <View style={styles.attachmentContainer}>
            <Image source={{ uri: attachedImage }} style={{width:30, height:30, borderRadius:3}} />
            <TouchableOpacity onPress={cancelImageSend}>
              <Ionicons name="close" size={20} color={Colors.text_color} />
            </TouchableOpacity>
          </View>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
          cursorColor={Colors.primary_color}
        />
        
        <TouchableOpacity onPress={handleSendMessage} >
          <Ionicons name="send" size={30} color={Colors.primary_color} />
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_color,
  },
  messageList: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  sentMessage: {
    backgroundColor: Colors.primary_color,
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#4b94b1',
    alignSelf: 'flex-start',
    
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.background_color,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    fontSize:15,
    fontWeight:'light',
    
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  attachedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
    alignContent:'center'
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover', // This will make sure the image covers the entire background
    width: '100%',
    height: '100%',
  }
});

export default CopilotPage;
