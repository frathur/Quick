import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { Avatar } from 'react-native-paper';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUserStore } from '../store/UserDataStore';

const ChannelBar = ({item, onPress, followPressed, unfollowPressed}) => {
  const { loggedInUser } = useUserStore()

    return (
        <TouchableOpacity style={styles.channelContainer} onPress={onPress}  >
        <View style={{flexDirection:'row'}}>
            <Avatar.Image style={{marginLeft:2}}  size={80} source={{uri:item.avatarUrl}} />
            {![...item?.followers].includes(loggedInUser) ?
            <TouchableOpacity onPress={followPressed} style={{flexDirection:'row', padding:5, borderWidth:0.5, height:"40%", marginHorizontal:12,
            marginLeft:'40%'

            }} >
                <Text style={{paddingHorizontal:8}}>Follow</Text>
                <Ionicons style={{marginHorizontal:9}} name='add' size={20} color={Colors.primary} />
            </TouchableOpacity>

            :<TouchableOpacity onPress={unfollowPressed} style={{flexDirection:'row', padding:5, borderWidth:0.5, height:"40%", marginHorizontal:12,
            marginLeft:'40%'

            }} >
                <Text style={{paddingHorizontal:8}}>Unfollow</Text>
                <Ionicons style={{marginHorizontal:9}} name='remove' size={20} color={Colors.primary} />
            </TouchableOpacity> }

        </View>
        <Text style={styles.channelTitle}>{item.name}</Text>
        <Text style={styles.channelDescription}>{item.description}</Text>
        <View style={{flexDirection:'row'}}>
            <SimpleLineIcons style={{paddingHorizontal:4, marginVertical:8}} name="user-follow" size={15} color='#524f4f' />
            <Text  style={{paddingHorizontal:4, marginVertical:8, color:'#524f4f'}} >{item.followers ? item.followers.length : 'No followers'} followers</Text>
            {[...item.followers].includes(loggedInUser)?<Text  style={{paddingHorizontal:4, marginVertical:8, color:'#524f4f', marginLeft:"45%"}} >Subscribed</Text> :null }
        </View>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    channelContainer: {
        backgroundColor: Colors.background_color,
        padding: 16,
        borderBottomWidth:0.8,
        borderBottomColor:Colors.primary_color

      },
      channelTitle: {
        fontSize: 20,
        fontWeight: '500',
        paddingHorizontal:1,
        color:Colors.primary_color
      },
      channelDescription: {
        fontSize: 14,
        color: Colors.gray,
        paddingHorizontal:1,
        marginVertical:4,
        fontWeight:'300'
      },
})

export default ChannelBar;
