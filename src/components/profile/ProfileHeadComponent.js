import React, { useState } from 'react'
import {StyleSheet, Dimensions, Text, View} from 'react-native'
import * as Color from '../../../global/colors'

// Component for the basic user info for profile
const ProfileHeadComponent = ({user, navigation, token, loading}) => {

    // Variables for component
    const [loadingData, setLoadingData] = useState(false)

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.h}>{user.first} {user.last}</Text>
                <Text style={styles.h2}>Member since {formatDate(new Date())}</Text>
            </View>
        </View> 
    )
}

const styles = StyleSheet.create({
    textContainer: {
        marginBottom: Dimensions.get('window').height * .01,
    },
    h: {
        marginTop: Dimensions.get('window').height * .03,
        marginBottom: Dimensions.get('window').height * .015,
        fontSize: Dimensions.get('window').height * .033,
        textAlign: 'center',
        textTransform: 'capitalize',
        fontFamily: 'QuicksandBold',
        color: Color.WHITE,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2
    },
    h2: {
        fontSize: Dimensions.get('window').height * .017,
        textAlign: 'center',
        textTransform: 'capitalize',
        fontFamily: 'QuicksandMedium',
        color: Color.WHITE,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2
    }
})

export default ProfileHeadComponent