import React, { useEffect, useState } from 'react'
import {StyleSheet, View, Dimensions, TouchableOpacity, Text} from 'react-native'
import * as Color from '../../../global/colors'
import {SimpleLineIcons , Ionicons } from '@expo/vector-icons';
import { serverName } from '../../api/serverName';
import { StackActions } from '@react-navigation/native';
import api from '../../api/server'
import { getTimestamp } from '../../functions/GetTimeAgo'
import BetterImage from '../general/BetterImage';
import ScaleView from '../general/ScaleView';

// The post object that has user, image, and post information - Individual post object
const PostComponent = ({navigation, post, localUser, token, index, navigateToPenguinScreen, updateRemovedPost, penguin, user, setErrorModal}) => {

    // Variables for the user post
    const [loading, setLoading] = useState(true);
    const [isHelping, setIsHelping] = useState(false)
    const [isTooLate, setIsTooLate] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [isOwnPost, setIsOwnPost] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    // Get the user from server with given id and set appropriate values
    const getUserData = async () => {
        try {
            setLoadingData(true)
            if (!penguin || !user) {
                console.log("Invalid post")
                setIsInvalid(true)
                return
            }

            // Checks if post is private
            if ("isPrivate" in post && post.isPrivate) {
                setIsPrivate(true)
            }
            else {
                setIsPrivate(false)
            }

            // Checks if it is the user's own post
            if (user._id == localUser._id) {
                setIsOwnPost(true)
            }
            else {
                setIsOwnPost(false)
            }

            // Check if the local user is helping out penguin
            if (penguin.friendsHelpingYou.includes(localUser._id)) {
                setIsHelping(true)
            }
            else {
                setIsHelping(false)
            }

            // Checks if local user has already requested to send info to user
            if (penguin.friendsTryingToHelp.includes(localUser._id)) {
                setIsSent(true)
            }
            else {
                setIsSent(false)
            }
            setLoading(false)
            setLoadingData(false)
        }
        catch (err) {
            console.log(err)
            setLoading(false)
            setLoadingData(false)
        }
    }

    // Decide to help out a user
    const helpUser = async () => {
        setLoadingData(true)
        const authStr = 'Bearer '.concat(token); 
        try {
            const response = await api.post('/helpUser', {userId: user._id, requireApproval: post.requireApproval}, {headers: {Authorization: authStr}})
            if (!response) {
                throw "error in helping user"
            }
            if (response.data.isHelping == null) {
                setIsTooLate(true)
                setLoadingData(false)
                return
            }
            setIsSent(true)
            setIsHelping(response.data.isHelping)
            setLoadingData(false)
        }
        catch (err) {
            console.log(err)
            setLoadingData(false)
            setErrorModal(true)
        }
    }

    // Decide to help out a user
    const cancelRequestToHelp = async () => {
        setLoadingData(true)
        const authStr = 'Bearer '.concat(token); 
        try {
            const response = await api.post('/cancelRequestToHelp', {userId: user._id}, {headers: {Authorization: authStr}})
            if (!response) {
                throw "Error in request to cancel helping"
            }
            setIsSent(false)
            setIsHelping(false)
            setLoadingData(false)
        }
        catch (err) {
            console.log(err)
            setLoadingData(false)
            setErrorModal(true)
        }
    }

    // Delete a post
    const deletePost = async () => {
        setModalVisible(false)
        let postId = post._id
        const authStr = 'Bearer '.concat(token); 
        try {
            let obj = {
                headers: {Authorization: authStr},
                data: {postId}
            }
            const response = await api.delete('/deletePost', obj)
            if (!response) {
                throw "error in trying to delete a post"
            }
            console.log("Sucessfully deleted a post")
            updateRemovedPost(index)
        }
        catch (err) {
            console.log(err)
            setModalVisible(false)
            setErrorModal(true)
        }
    }

    // Sends a report for the server to handle
    const reportUser = async () => {
        setLoadingData(true)
        const authStr = 'Bearer '.concat(token); 
        try {
            const response = await api.post('/reportUser', {userId: user._id}, {headers: {Authorization: authStr}})
            setLoadingData(false)
            setModalVisible(false)
        }
        catch (err) {
            console.log(err)
            setLoadingData(false)
            setModalVisible(false)
        }
    }

    // Sends the user to the other profile screen when 
    const navigateToUser = () => {
        setLoadingData(true)
        const pushAction = StackActions.push('OtherProfile', {user: user, userId: user._id, token})
        navigation.dispatch(pushAction);
        setTimeout(() => {
            setLoadingData(false)
        }, 500);
    }
    


    // Gives the top post some margin on top
    const isFirst = () => {
        if (index === 0) {
            return {
                marginTop: Dimensions.get('window').height * .02
            }
        }
    }

    // Runs when the component is first created or when localuser has changed
    useEffect(() => {
        getUserData()
    }, [penguin, user]);

    // Makes sure that component is done loading and component has valid data
    if (loading || !user) {
        return <View></View>
    }
    else if (isInvalid) {
        return <></>
    }
    else {
        return (
            <ScaleView>
                <View style={[styles.container, isFirst()]}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.imageContainer} onPress={navigateToUser} disabled={loadingData} >
                            <BetterImage style={styles.image} source={{uri: serverName + user.photos[0]}} resizeMode="cover" />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.name}>{user.first} {user.last} {isPrivate ? <Ionicons name="ios-lock-closed-outline" /> : null}</Text>
                            <Text style={styles.timestamp}>{getTimestamp(new Date(post.createdAt))} ago</Text>
                        </View>
                    </View>
                    <Text style={styles.postText}>{post.postText}</Text>
                    <View style={[styles.helpButton, styles.helpButtonDone]} disabled={loadingData}>
                        <Text style={[styles.helpButtonText, styles.helpButtonTextDone]}>View more info</Text>
                    </View>
                </View> 
            </ScaleView>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width * .9,
        marginHorizontal: Dimensions.get('window').width * .05,
        marginVertical: Dimensions.get('window').height * .01,
        backgroundColor: Color.WHITE,
        shadowColor: 'rgba(0,0,0,.4)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingVertical: Dimensions.get('window').height * .04,
        paddingHorizontal: Dimensions.get('window').width * .02,
        borderRadius: 10
    },
    headerContainer: {
        flexDirection: 'row'
    },
    headerTextContainer: {
        flex: 4,
        marginTop: Dimensions.get('window').height * .005, 
        paddingHorizontal: Dimensions.get('window').width * .02,
    },
    name: {
        fontFamily: "QuicksandSemiBold",
        fontSize: Dimensions.get('window').height * .02, 
        marginBottom: Dimensions.get('window').height * .005, 
        color: Color.HEADER
    },
    timestamp: {
        fontSize: Dimensions.get('window').height * .012,
        color: Color.HEADER,
        opacity: .4,
        fontFamily: "QuicksandMedium"
    },
    imageContainer: {
        flex: 1,
        marginLeft: Dimensions.get('window').width * .03,
        shadowColor: 'rgba(0,0,0,.2)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 1,
    },
    image: {
        width: Dimensions.get('window').width * .13,
        height: Dimensions.get('window').width * .13,
        borderRadius: 1000,
    },
    postText: {
        fontFamily: "QuicksandMedium",
        fontSize: Dimensions.get('window').height * .014,
        lineHeight: Dimensions.get('window').height * .026,
        marginHorizontal: Dimensions.get('window').width * .05,
        marginTop: Dimensions.get('window').height * .02,
        color: Color.TEXT
    },
    helpButtonText: {
        fontSize: Dimensions.get('window').height * .015,
        color: Color.MAIN,
        textAlign: "center",
        fontFamily: "QuicksandSemiBold"
    },
    helpButton: {
        borderColor: Color.MAIN,
        borderWidth: 1,
        paddingVertical: Dimensions.get('window').height * .015,
        borderRadius: 5,
        marginTop: Dimensions.get('window').height * .02,
        width: Dimensions.get('window').width * .8,
        marginHorizontal: Dimensions.get('window').width * .05,
    },
    helpButtonTextDone: {
        color: 'rgba(0,0,0,.2)',
    },
    helpButtonDone: {
        borderColor: 'rgba(0,0,0,.1)',
    },
    optionsView: {
        position: 'absolute',
        top: 15,
        right: 10,
        zIndex: 2
    },
    optionsIcon: {
        fontSize: Dimensions.get('window').height * .014,
        color: 'rgba(0,0,0,.2)',
    },

})

export default PostComponent