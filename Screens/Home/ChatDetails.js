import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, Text, Image, Pressable, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/Colors';
import { Avatar } from 'react-native-paper';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../../Configs/firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { arrayUnion, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../store/UserDataStore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Video, ResizeMode } from 'expo-av';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

firebase.initializeApp(firebaseConfig);

const ChatDetails = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const flatListRef = useRef(null);
  const [resultData, setAllData] = useState(null);
  const { id, items } = route.params;
  const { loggedInUser } = useUserStore();
  const [imageblob, setImageBlob] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} style={{ paddingTop: 6, margin: 4, color: Colors.primary_color }} />
          <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={() => navigation.navigate('Profile', { username: route.params.username })}>
            <Avatar.Image size={45} source={{ uri: route.params.profileUrl }} />
          </TouchableOpacity>
        </TouchableOpacity>
      ),
      headerTitle: items?.createdBy === loggedInUser
        ? items?.receiver?.split("@")[0]
        : items?.createdBy?.split("@")[0] || '',
      headerTitleStyle: {
        color: Colors.text_color,
        fontWeight: '200',
      },
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Video-Call')} >
            <Ionicons style={{ padding: 3, marginHorizontal: 3, color: Colors.primary_color }} size={25} name='videocam-outline'></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Voice-Call', { avatarUrl: route.params.profileUrl, username: route.params.username })}>
            <Ionicons style={{ padding: 3, marginHorizontal: 3, color: Colors.primary_color }} size={25} name='call-outline'></Ionicons>
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation, route.params?.username, items?.createdBy, items?.receiver]);

  useEffect(() => {
    const chatRef = doc(db, 'chats', id);

    // Set up the onSnapshot listener
    const unsub = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.messages) {
          setAllData(data.messages);
        } else {
          console.log('Messages field is missing in the document');
        }
      } else {
        alert.log("Can't Load Chats");
      }
    });

    // Clean up the onSnapshot listener on unmount
    return () => unsub();
  }, [id, resultData]); // Add chatId to dependency array to re-run the effect when chatId changes

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' || attachedImage) {
      let downloadURL = null;
      if (imageblob) {

        const blob = await imageblob;
        const storage = getStorage();
        const storageRef = ref(storage, `media/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        downloadURL = await getDownloadURL(storageRef);

      }

      const newMessageObj = {
        sender: loggedInUser,
        message: newMessage,
        receiver: route.params.username,
        imageUrl: downloadURL,
        sentDate: new Date().toDateString(),
        sentTime: new Date().toLocaleTimeString(),
        isMediaVideo: isVideo
      };

      setNewMessage('');
      const chatRef = doc(db, 'chats', id);
      await updateDoc(chatRef, {
        messages: arrayUnion(newMessageObj), // Add new message to the array
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
      setImageBlob(blob);
      switch (result.assets[0].type) {
        case 'video':
          setIsVideo(true);
          break;
        case 'image':
          setIsVideo(false);
          break;
      }
      setAttachedImage(result.assets[0].uri);
    }
  };

  const cancelImageSend = () => {
    setAttachedImage(null);
    setImageBlob(null);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === loggedInUser ? styles.sentMessage : styles.receivedMessage]}>
      {item.imageUrl && item.isMediaVideo &&
        <Pressable onPress={() => status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()}>
          <Video
            useNativeControls
            style={[styles.attachedImage]}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
            ref={video} source={{ uri: item.imageUrl }} />
        </Pressable>
      }
      {item.imageUrl && !item.isMediaVideo &&
        <Image source={{ uri: item.imageUrl }} style={styles.attachedImage} />
      }
      <Text style={[styles.messageText]}>{item.message}</Text>
      <Text style={{ alignSelf: 'flex-end', color: 'white', fontSize: 10 }}>{item.sentTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/back.jpg')} style={styles.backgroundImage}>
        <FlatList
          ref={flatListRef}
          data={resultData}
          renderItem={renderItem}
          keyExtractor={(item) => item.ChatId}
          contentContainerStyle={[styles.messageList]}
        />
      </ImageBackground>
      <View style={styles.inputContainer}>
        {attachedImage && (
          <View style={styles.attachmentContainer}>
            <Image source={{ uri: attachedImage }} style={{ width: 30, height: 30, borderRadius: 3 }} />
            <TouchableOpacity onPress={cancelImageSend}>
              <Ionicons name="close" size={20} color={Colors.text_color} />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="add-circle-outline" style={{ marginHorizontal: 1 }} size={30} color={Colors.primary_color} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
          cursorColor={Colors.primary_color}
        />
        <TouchableOpacity onPress={handleAttachImage}>
          <Ionicons name='attach' style={{ marginHorizontal: 1 }} size={30} color={Colors.primary_color} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name='send' style={{ marginHorizontal: 1 }} size={30} color={Colors.primary_color} />
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
    backgroundColor: '#86898f',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
    fontSize: 15,
    fontWeight: 'light',
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
    alignContent: 'center'
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover', // This will make sure the image covers the entire background
    width: '100%',
    height: '100%',
  }
});

export default ChatDetails;
