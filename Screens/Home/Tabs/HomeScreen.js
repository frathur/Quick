import React from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
import Colors from '../../../constants/Colors';
import ChatBar from '../../../Components/ChatBar';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, collection, where, query, orderBy } from "firebase/firestore";
import { firebaseConfig } from '../../../Configs/firebase';
import { Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore } from '../../../store/UserDataStore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const HomeScreen = ({ navigation }) => {
  const [allChats, setAllChats] = useState([])
  const [filteredChats, setFilteredChats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const {loggedInUser} = useUserStore()

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterChats(query);
  };

  const filterChats = (query) => {
    if (query.length > 0 && allChats && allChats.length > 0) {
      const filteredData = allChats.filter((item) => {
        return (
          item.receiver && 
          item.receiver.trim().toLowerCase().includes(query.trim().toLowerCase())
        );
      });
      setFilteredChats(filteredData);
    } else {
      setFilteredChats(allChats);
    }
  };

  const renderItem = ({ item }) => (
    
    <ChatBar
      avatarUrl={item.profileUrl}
      username={`${item.createdBy === loggedInUser ?  item.receiver : item.createdBy}`}
      lastMessage={item.messages[item.messages.length - 1]?.message}
      onPress={()=> navigation.navigate('Chat-Details', {username:item.receiver, profileUrl: item.profileUrl, id:item.chatId, items: item})}
    />
  );

  useEffect(() => {
    setIsLoading(true);
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', loggedInUser));
    const unsub = onSnapshot(q, (snapshot) => {
      const chats = [];
      snapshot.docs.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      console.log(chats)
      const sortedChats = chats.sort((a, b) => b.updatedAt - a.updatedAt);
      setAllChats(sortedChats);
      setFilteredChats(chats);
      setIsLoading(false);
    });
    return () => unsub();
  }, [ loggedInUser]);

  return (
    <Provider>
      
      <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ marginHorizontal: 3,
           marginVertical: 8,
            backgroundColor: '#e8f3f5', 
            height: 55,
            width:320,
            marginLeft:20,
            marginRight:20,
          }}
          cursorColor={Colors.primary_color}
        
      />
        {isLoading ? (
          <ActivityIndicator size={20} color={Colors.primary_color} />
        ) : (
          filteredChats && filteredChats.length > 0 ? (
            <FlatList
              data={filteredChats}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <Text style={styles.noDataText}>No chats found.</Text>
          )
        )}
        <FAB
          icon="chat-plus"
          style={styles.fab}
          color={Colors.secodary_color_tint}
          onPress={() => navigation.navigate("Find-User")}
        />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background_color,
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom: 16,
    marginLeft:15,
    fontSize:5,
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary_color,
  },
  noDataText: {
    fontSize: 5,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
