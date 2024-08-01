import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { Avatar, Chip, Divider, Searchbar } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';

import { firebaseConfig } from '../../Configs/firebase';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection } from 'firebase/firestore';
import { useUserStore } from '../../store/UserDataStore';

import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CreateChannelScreen = ({ navigation }) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [checked, setChecked] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://img.eg');
  const { loggedInUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [imageblob, setImageBlob] = useState(null);
  const [imageLocal, setLocalImage] = useState('https://imag.eg');
  const tags = [
    { id: 1, label: 'Education' },
    { id: 2, label: 'Food' },
    { id: 3, label: 'Entertainment' },
    { id: 4, label: 'Travel' },
    { id: 5, label: 'Sports' },
    { id: 6, label: 'Technology' },
    { id: 7, label: 'Business' },
    { id: 8, label: 'Health' },
    { id: 9, label: 'Arts' },
    { id: 10, label: 'Music' },
  ];

  const handleTagSelect = (tag) => {
    if (selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleCreateChannel = async () => {
    try {
      const channelId = 'channel_' + Date.now().toString();
      const newChatRef = doc(collection(db, 'channels'), channelId);
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${Date.now()}`);

      let downloadURL = '';
      if (imageblob) {
        await uploadBytes(storageRef, imageblob);
        downloadURL = await getDownloadURL(storageRef);
      }

      await setDoc(newChatRef, {
        channelId: channelId,
        name: channelName,
        description: channelDescription,
        createdBy: loggedInUser,
        admins: [loggedInUser],
        followers: [loggedInUser],
        posts: [],
        tags: [...selectedTags],
        avatarUrl: downloadURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isMonetized: checked,
        dateCreated: new Date().toLocaleString(),
      });

      setSelectedTags([]);
      setChannelDescription('');
      setChannelName('');
      setImageBlob('');
      setLocalImage('');

      alert("Channel Created");
    } catch (error) {
      console.error('Error creating channel:', error);
      alert('Cannot Create Channel');
      setImageBlob('');
      setLocalImage('');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      setImageBlob(blob);
      setLocalImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Avatar.Image style={{ margin: 4 }} size={100} source={{ uri: imageLocal }} />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Channel Name"
          value={channelName}
          onChangeText={setChannelName}
        />
        <TextInput
          style={styles.input}
          placeholder="Channel Description"
          value={channelDescription}
          onChangeText={setChannelDescription}
        />
      </View>
      <Divider style={{ marginVertical: 15 }} />

      {/* <View style={{ flexDirection: 'row' }}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          color={Colors.primary_color}
        />
        <Text style={{ paddingTop: 8 }}>Monetize</Text>
      </View> */}

      <View>
        <Text style={styles.subscriptionText}>
        Enhance your QuickTalk channel with our premium features. 
        </Text>
        <Text style={styles.subscriptionDescription}>
        Take advantage of our platform to monetize your channel and content. 
        Upgrade to a paid subscription and unlock premium features
         and powerful tools designed to help you generate revenue and grow your audience
        </Text>
      </View>
      <Divider style={{ marginVertical: 15 }} />
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.tagContainerWrapper}>
        <ScrollView horizontal style={[styles.tagContainer, { maxHeight: 80 }]}>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              style={[
                styles.tag,
                selectedTags.some((t) => t.id === tag.id) && styles.selectedTag,
              ]}
              onPress={() => handleTagSelect(tag)}
            >
              {tag.label}
            </Chip>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.createButton} onPress={handleCreateChannel}>
        <Text style={styles.createButtonText}>Create Channel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_color,
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: '100%',
  },
  inputContainer: {
    marginVertical: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary_color,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor:'white'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagContainerWrapper: {
    marginBottom: 11,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  
  },
  tag: {
    backgroundColor: 'white',
    marginRight: 8,
  },
  selectedTag: {
    backgroundColor: Colors.primary_color,
    elevation: 2,
    color: 'white',
    borderColor:Colors.primary_color
  },
  createButton: {
    backgroundColor: Colors.primary_color,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subscriptionDescription: {
    fontSize: 16,
    lineHeight: 18,
    color: '#666',
  },
});

export default CreateChannelScreen;
