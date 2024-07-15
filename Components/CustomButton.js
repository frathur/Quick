import {Text, Pressable, View, StyleSheet, Touchable} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';


function CustomButton(props) {
    return (
        <Pressable
            onPress={props.onPress}
            style={({ pressed }) => [
                props.primary && styles.buttonPrimary,
                props.secondary && styles.buttonSecondary,
                pressed && styles.pressed
            ]}

        >

                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <Text
                        style={[
                            props.primary && styles.buttonTextPrimary,
                            props.secondary && styles.buttonTextSecondary
                        ]}
                    >
                        {props.title}
                    </Text>
                </View>
            

        </Pressable>
    );
}

export default CustomButton

const styles =  StyleSheet.create( {
    buttonPrimary: {
        borderRadius: 8,
        fontSize: 20,
        width: "70%",
        height: 45,
        margin: 12,
        backgroundColor: Colors.primary_color,
        color:'white',
        alignSelf: 'center'
    },
     buttonTextPrimary: {
        color:"#f5fafc",
        fontWeight: 400,
        fontSize: 14,
        paddingTop: 12
    },
    buttonTextSecondary : {
        color:Colors.primary_color,
        fontWeight: 400,
        paddingTop: 12,
        fontSize:14
        
    },
    buttonSecondary: {
        borderRadius: 8,
        fontSize: 20,
        width: "70%",
        height: 45,
        margin: 12,
        backgroundColor: 'white',
        borderColor: Colors.primary_color,
        borderWidth: 1
    },
    pressed: {
        opacity: 0.7
    }
 
})