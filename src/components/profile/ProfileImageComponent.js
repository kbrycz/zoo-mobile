import React from 'react'
import {StyleSheet, Dimensions, View, Image, TouchableOpacity} from 'react-native'
import * as Color from '../../../global/colors'
import { serverName } from '../../api/serverName'
import BetterImage from '../general/BetterImage'

// The image component of the profile screens
const ProfileImageComponent = ({image, clickFunction}) => {

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {
                    !image
                    ? null
                    : <TouchableOpacity onPress={clickFunction}>
                        <BetterImage isWhite={true} cacheKey={null} style={styles.image} source={{uri: serverName + image}} />
                        {/* <BetterImage isWhite={true} cacheKey={noCache ? null : image.split('/')[1].split(".")[0]} style={styles.image} source={{uri: serverName + image}} /> */}
                      </TouchableOpacity>
                }
                
            </View>
        </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * .09,
    },
    image: {
        width: Dimensions.get('window').height * .11,
        height: Dimensions.get('window').height * .11,
        borderRadius: 1000, 
    },
    imageContainer: {
        marginTop: Dimensions.get('window').height * .04,
        width: Dimensions.get('window').height * .125,
        height: Dimensions.get('window').height * .125,
        shadowColor: Color.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,   
        borderRadius: 1000, 
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Color.WHITE,
    },
})

export default ProfileImageComponent