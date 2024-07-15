import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    

} from 'react-native'
import Colors from '../constants/Colors'
import { Avatar }from 'react-native-paper'
import { useUserStore } from '../store/UserDataStore'

const AccountBar  = ({avatarUrl, username, bio, onPress, user}) => {
    const {loggedInUser} = useUserStore()
    return (
        <TouchableOpacity style={styles.outContainer} onPress={onPress}>
            <View style={styles.chatbar} >
                <Avatar.Image size={60} source={{uri:avatarUrl}} />
                <View style={{marginHorizontal:12,paddingTop:8}} >
                    <Text style={styles.profileNameText}>
                        {user?.email === loggedInUser? '(You) Save Messages': user?.username}
                        </Text>
                    <Text style={styles.lastMessage}>{bio}
                    </Text>
                </View>

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    chatbar:{
        flexDirection:'row',
        width: "100%",
        alignContent:'center'
       
    },
    profileNameText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: Colors.primary_color
    },
    lastMessage: {
        fontSize: 14,
        color: '#9ba3a8',
        fontWeight:'normal'
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


export default AccountBar