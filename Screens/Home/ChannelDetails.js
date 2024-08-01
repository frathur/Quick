import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, Text, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/Colors';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../../Configs/firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { arrayUnion, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../store/UserDataStore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

firebase.initializeApp(firebaseConfig)

const ChannelDetails = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const flatListRef = useRef(null);
  const [resultData, setAllData] = useState(null)
  const { item, id } = route.params
  const { loggedInUser } = useUserStore()
  const [imageblob, setImageBlob] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} style={{ paddingTop: 12, margin: 4 }} />
          <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={() => navigation.navigate('Profile')}>
            <Avatar.Image size={50} source={{ uri: item?.avatarUrl }} />
          </TouchableOpacity>
        </TouchableOpacity>
      ),
      headerTitle: item?.name,
      headerTitleStyle: {
        color: Colors.text_color,
        fontWeight: '200',
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Ionicons style={{ padding: 3, marginHorizontal: 3 }} size={20} name='ellipsis-vertical'></Ionicons>
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, item?.name, item?.createdBy, item?.posts])

  useEffect(()=>{
    if (item?.admins.includes(loggedInUser)){
      setIsAdmin(true)
    }
  },[])
  


  useEffect(() => {
    const chatRef = doc(db, 'channels', item?.channelId);

    // Set up the onSnapshot listener
    const unsub = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // console.log(data.posts)
        if (data && data.posts) {
          setAllData(data.posts);
        } else {
          console.log('Messages field is missing in the document');
        }
      } else {
        alert.log("Can't Load Chats");
      }
    });

    // Clean up the onSnapshot listener on unmount
    return () => unsub();
  }, [resultData]); 

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' || attachedImage) {
      let downloadURL = null;
      if (imageblob) {
        // Upload the image to Firebase Storage
        // const response = await fetch(attachedImage);
        const blob = await imageblob;
        const storage = getStorage();
        const storageRef = ref(storage, `media/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);

      }

      const newPostObj = {
        sender: loggedInUser,
        message: newMessage,
        imageUrl: downloadURL,
        sentDate: new Date().toDateString(),
        sentTime: new Date().toLocaleTimeString(),
        likes:0,
        dislikes:0,
      };

      setNewMessage('');
      const channelRef = doc(db, 'channels', id);
      await updateDoc(channelRef, {
        posts: arrayUnion(newPostObj), // Add new message to the array
        updatedAt: Date.now(),
      });
      setAttachedImage(null);
      const lastIndex = resultData.length - 1;
      flatListRef.current.scrollToIndex({ index: lastIndex, animated: true });
    }
  };

  const handleAttachImage = async () => {
    // Request camera roll permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      setImageBlob(blob)

      setAttachedImage(result.assets[0].uri);
    }
}
const cancelImageSend = ()=> {
  setAttachedImage(null)
  setImageBlob(null)
}
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
    <ImageBackground source={require('../../assets/back.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        { resultData?.length === 0 && <ActivityIndicator style={{marginVertical:15}} size={20} color={Colors.primary_color} />}
      
          <FlatList
            ref={flatListRef}
            data={resultData}
            renderItem={renderItem}
            keyExtractor={(item) => item.ChatId}
            contentContainerStyle={[styles.messageList]}
          />
        

        { isAdmin?  
        <View style={styles.inputContainer}>
          {attachedImage && (
            <View style={styles.attachmentContainer}>
              <Image source={{ uri: attachedImage }} style={{width:30, height:30, borderRadius:3}} />
              <TouchableOpacity onPress={cancelImageSend}>
                <Ionicons name="close" size={20} color={Colors.text_color} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="add-circle-outline" style={{marginHorizontal:1}} size={30} color={Colors.primary_color} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAttachImage}>
            <Ionicons name='film-outline' style={{marginHorizontal:1}}  size={30} color={Colors.primary_color} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={handleSendMessage}
            cursorColor={Colors.primary_color}
          />
          
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={30} color={Colors.primary_color} />
          </TouchableOpacity>
          
        </View>:
          <View style={{backgroundColor:Colors.secodary_color_tint}} >
            <Text style={{textAlign:'center', color:Colors.tertiary_color}} >Only Admins Can Send Messages</Text>
        </View>
        }
        
      </View>
    </ImageBackground>
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
    marginHorizontal:12
  },
  sentMessage: {
    backgroundColor: Colors.primary_color,
    alignSelf: 'left',
    width:'90%'
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

export default ChannelDetails;
