import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package
import { doc, getDocs, onSnapshot } from 'firebase/firestore';
import {useUserStore} from '../../store/UserDataStore'
import { firebaseConfig } from '../../Configs/firebase';
import { initializeApp} from 'firebase/app';
import { getFirestore, collection, query, where } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

firebase.initializeApp(firebaseConfig)



function StudioScreen({navigations}) {
    const {loggedInUser} = useUserStore();
    const [chans, setChannels] = useState([])
    useEffect(() => {
        const fetchChannels = async () => {
          const chanRef = collection(db, 'channels');
          const q = query(chanRef, where('createdBy', '==', loggedInUser));
          const snapshot = await getDocs(q);
          const chns = snapshot.docs.map((doc) => doc.data());
          setChannels(chns)
          console.log(chans)
        };
        fetchChannels();
      }, [loggedInUser]);
  
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity  style={[styles.option, styles.alignItemsCenter]}>
                    <Text style={styles.optionName}>Total Revenue</Text>
                    <Ionicons name='cash-outline' size={24} color="black" />
                    <Text>100ghc</Text>
        </TouchableOpacity>
        <View style={{marginTop:40}}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>Channel Summary</Text>

                <TouchableOpacity style={[styles.option, styles.alignItemsCenter]}>
                    <Text style={styles.optionName}>Channel Name</Text>
                    <Ionicons name="people-outline" size={24} color="black" />
                    <Text>300</Text>
                </TouchableOpacity>
                <TouchableOpacity  style={[styles.option, styles.alignItemsCenter]}>
                    <Text style={styles.optionName}>Channel Name</Text>
                    <Ionicons name="people-outline" size={24} color="black" />
                    <Text>2.2k</Text>
                </TouchableOpacity>

            </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:Colors.background_color,
        padding:20
    },
    channelSummary: {

    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth:1,
        paddingVertical: 10,
    },
})
export default StudioScreen