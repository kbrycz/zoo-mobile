import React from 'react'
import {StyleSheet, Dimensions, Text, View, TouchableOpacity} from 'react-native'
import { Feather } from '@expo/vector-icons'; 
import * as Color from '../../../global/colors'

// Shows buttons to all the settings pages on the profile
const ProfileButtonsComponent = ({user, navigation}) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}
                              onPress={() => navigation.navigate('ProfileSettings', {screen: "ProfileSettingsScreen", params: {user}})}>
                <Text style={styles.buttonText}>Profile</Text>
                <Feather name="user" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} 
                              onPress={() => navigation.navigate('Account', {screen: "AccountScreen", params: {user}})}>
                <Text style={styles.buttonText}>Account</Text>
                <Feather name="settings" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                              onPress={() => navigation.navigate('Help')}>
                <Text style={styles.buttonText}>Help</Text>
                <Feather name="message-circle" style={styles.icon} />
            </TouchableOpacity>
        </View> 
    )
}

const styles = StyleSheet.create({
    icon: {
        flex: 1,
        fontSize: Dimensions.get('window').height * .02,
        textAlign: "right",
        color: Color.MAIN
    },
    container: {
        marginTop: Dimensions.get('window').height * .12,
        marginHorizontal: Dimensions.get('window').width * .05,
    },
    button: {
        marginBottom: Dimensions.get('window').height * .015,
        borderRadius: 5,
        flexDirection: 'row',
        padding: Dimensions.get('window').height * .02,
        paddingHorizontal: Dimensions.get('window').height * .03,
        backgroundColor: Color.WHITE,
        shadowColor: Color.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3, 
    },
    buttonText: {
        flex: 1,
        fontSize: Dimensions.get('window').height * .018,
        fontFamily: 'QuicksandBold',
        color: Color.MAIN,
    }
})

export default ProfileButtonsComponent