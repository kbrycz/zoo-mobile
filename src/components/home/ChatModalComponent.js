import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View, Dimensions, SafeAreaView, 
         TouchableOpacity, Switch, ScrollView, ActivityIndicator, Image } from "react-native";
import api from '../../api/server';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; 
import { serverName } from "../../api/serverName";
import * as Color from '../../../global/colors'
import BetterImage from "../general/BetterImage";
import HelpModalComponent from "../modal/HelpModalComponent";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "../general/LoadingIndicator";
import ScaleView from "../general/ScaleView";

// Handles all creating post information and updates user on Penguin stages
const ChatModalComponent = ({modalVisible, setModalVisible, user}) => {

    const [loadingData, setLoadingData] = useState(false)
    const [postText, setPostText] = React.useState("")
    const [answer, setAnswer] = React.useState("")

    const cancel = () => {
        setModalVisible(false)
    }

    const newQuestion = () => {
        setPostText("")
        setAnswer("")
        setLoadingData(false)
    }

    const askQuestion = async () => {
        setAnswer("")
        if (!postText) return; // Check if there's text to ask
        setLoadingData(true); // Indicate loading
        try {
            let tokenTemp = await AsyncStorage.getItem('token')

            const authStr = 'Bearer ' + tokenTemp;
            const response = await api.get(`/ask?question=${encodeURIComponent(postText)}`, {
                headers: { Authorization: authStr }
            });
            if (response && response.data) {
                setAnswer(response.data.answer); // Assuming the API returns an object with an answer key
            }
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Failed to get an answer. Please try again.");
        } finally {
            setLoadingData(false); // Reset loading indicator
        }
    };

    const renderBox = () => {
        if (loadingData) {
            return <View style={[styles.postButton, {backgroundColor: 'rgba(0,0,0,0)'}]}>
                                            <ActivityIndicator
                                                animating={true}
                                                size="small"
                                                color={Color.MAIN}
                                            />
                                      </View>
        }
        else if (!loadingData && answer.length > 0) {
            return <ScaleView>
                <View style={styles.postBox}>
                    <View style={styles.headerContainer}>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={require('../../../assets/main/scooby.jpg')} resizeMode="cover" />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.name}>Scooby</Text>
                            <Text style={styles.sub}>AI zoo expert</Text>
                        </View>
                    </View>
                    <Text style={styles.postText}>{answer}</Text>
                    <View style={styles.bottomLine} />
                    <TouchableOpacity style={styles.cancelContainer} onPress={cancel} disabled={loadingData}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postButton} onPress={newQuestion} disabled={loadingData || postText.length < 1}>
                        <Text style={styles.post}>New Question</Text>
                    </TouchableOpacity>
                    </View>
            </ScaleView>
        }
        else {
            return <ScaleView>
                <View style={styles.postBox}>
                        <View style={styles.headerContainer}>
                            <View style={styles.imageContainer}>
                                <BetterImage cacheKey={user.profilePicture} style={styles.image} source={{uri: serverName + user.profilePicture}} resizeMode="cover" />
                            </View>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.name}>{user.first} {user.last}</Text>
                                <Text style={styles.sub}>Limit of 10 questions per day</Text>
                            </View>
                        </View>
                        <TextInput
                            autoFocus
                            placeholder={"Are zebras white with black stripes or black with white stripes?"}
                            placeholderTextColor="rgba(0,0,0,.5)"
                            style={styles.postText}
                            multiline={true}
                            maxLength={132}
                            numberOfLines={1}
                            onChangeText={setPostText}
                            blurOnSubmit={false}
                            value={postText}/>
                        <View style={styles.bottomLine} />
                        <TouchableOpacity style={styles.cancelContainer} onPress={cancel} disabled={loadingData}>
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postButton} onPress={askQuestion} disabled={loadingData || postText.length < 1}>
                            <Text style={styles.post}>Ask</Text>
                        </TouchableOpacity>
                        </View>
            </ScaleView>
        }
    }

    return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}>
                <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
                    <SafeAreaView>
                    <View style={styles.backView}>
                        <TouchableOpacity onPress={cancel}>
                            <Ionicons name="close-outline" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textContainer}>
                            <Text style={styles.headerText}>Ask Scooby Anything</Text>
                            <Text style={styles.subText}>Meet Scooby, our zoo's expert AI</Text>
                    </View>
                    <View style={styles.whiteContainer}>
                        <View style={styles.line} />
                        <ScrollView style={styles.container}>
                            {renderBox()}
                        </ScrollView>
                    </View>
                    </SafeAreaView>
                </LinearGradient>
            </Modal>
    );
};

const styles = StyleSheet.create({
    grad: {
        height: Dimensions.get('window').height
    },
    container: {
        marginVertical: Dimensions.get('window').height * .02,
        flexGrow : 1
    },
    centeredView: {
        zIndex: 100,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        paddingBottom: Dimensions.get('window').height * .3,
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,.8)'
      },
      modalView: {
        width: Dimensions.get('window').width * .8,
        marginRight: Dimensions.get('window').width * .1,
        marginLeft: Dimensions.get('window').width * .1,
        backgroundColor: Color.WHITE,
        borderRadius: 10,
        padding: Dimensions.get('window').height * .025,
        alignItems: "center",
      },
      button: {
        zIndex: 100,
        width: Dimensions.get('window').width * .6,
        padding: Dimensions.get('window').height * .01,
        elevation: 2,
        borderRadius: 5,
        marginBottom: Dimensions.get('window').height * .02,
      },
      textStyle: {
        textAlign: "center",
        fontFamily: 'QuicksandSemiBold',
        color: Color.WHITE,
        fontSize: Dimensions.get('window').height * .018,
      },
      activity: {
        marginVertical: Dimensions.get('window').height * .03,
    },
      modalText: {
        textAlign: 'center',
        color: Color.MAIN,
        fontSize: Dimensions.get('window').height * .024,
        lineHeight: Dimensions.get('window').height * .045,
        fontFamily: 'QuicksandBold',
        marginTop: Dimensions.get('window').height * .03,
        marginBottom: Dimensions.get('window').height * .02,
      },
      modalSub: {
        marginHorizontal: Dimensions.get('window').width * .05,
        textAlign: 'justify',
        color: Color.HEADER,
        opacity: .5,
        fontSize: Dimensions.get('window').height * .014,
        lineHeight: Dimensions.get('window').height * .03,
        fontFamily: 'QuicksandMedium',
        marginBottom: Dimensions.get('window').height * .03,
      },
    whiteContainer: {
        backgroundColor: Color.BACKGROUND,
        height: Dimensions.get('window').height,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40
    },
        line: {
        marginTop: Dimensions.get('window').height * .03,
        width: Dimensions.get('window').width * .2,
        marginHorizontal: Dimensions.get('window').width * .4,
        backgroundColor: Color.LIGHT_BORDER,
        borderRadius: 1000,
        height: 4,
        
    },
    bottomLine: {
        marginTop: Dimensions.get('window').height * .06,
        marginBottom: Dimensions.get('window').height * .04,
        width: Dimensions.get('window').width * .78,
        marginLeft: Dimensions.get('window').width * .05,
        backgroundColor: Color.LIGHT_BORDER,
        borderRadius: 1000,
        height: 2,
        opacity: .1
    },
    textContainer: {
        marginTop: Dimensions.get('window').height * .03,
        marginHorizontal: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .03,
    },
    headerText: {
        marginBottom: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandBold',
        fontSize: Dimensions.get('window').height * .025,
        color: Color.WHITE,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2
    },
    subText: {
        marginBottom: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .015,
        color: "rgba(255,255,255,0.7)"
    },
    backView: {
        marginTop: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').height * .015,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .035,
        color: Color.WHITE
    },
    postBox: {
        width: Dimensions.get('window').width * .9,
        marginHorizontal: Dimensions.get('window').width * .05,
        paddingVertical: Dimensions.get('window').height * .03,
        paddingHorizontal: Dimensions.get('window').width * .015,
        marginBottom: Dimensions.get('window').height * .03,
        shadowColor: 'rgba(0,0,0,.4)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 5,
        borderRadius: 5,
        backgroundColor: Color.WHITE
    },
    headerContainer: {
        flexDirection: 'row'
    },
    headerTextContainer: {
        flex: 4,
        marginLeft: Dimensions.get('window').width * .01
    },
    name: {
        fontFamily: "QuicksandSemiBold",
        fontSize: Dimensions.get('window').height * .02, 
        marginVertical: Dimensions.get('window').height * .005, 
        color: Color.HEADER,
        
    },
    sub: {
        fontSize: Dimensions.get('window').height * .012,
        color: 'rgba(0,0,0,.2)',
        fontFamily: "QuicksandMedium",
    },
    imageContainer: {
        flex: 1,
        marginLeft: Dimensions.get('window').width * .03,
    },
    image: {
        width: Dimensions.get('window').width * .12,
        height: Dimensions.get('window').width * .12,
        borderRadius: 1000,
    },
    postText: {
        marginTop: Dimensions.get('window').height * .02, 
        marginHorizontal: Dimensions.get('window').width * .05,
        fontFamily: "QuicksandMedium",
        fontSize: Dimensions.get('window').height * .015, 
        lineHeight: Dimensions.get('window').height * .025, 
        color: Color.HEADER,
        opacity: .7
    },
    cancelContainer: {
        position: 'absolute',
        bottom: Dimensions.get('window').height * .025,
        left: Dimensions.get('window').width *.06,
    },
    cancel: {
        fontSize: Dimensions.get('window').height * .016,
        color: "rgba(0,0,0,0.2)",
        fontFamily: "QuicksandMedium"
    },
    postButton: {
        position: 'absolute',
        bottom: Dimensions.get('window').height * .015,
        right: Dimensions.get('window').width *.06,
        backgroundColor: Color.MAIN,
        paddingVertical: Dimensions.get('window').height * .01,
        paddingHorizontal: Dimensions.get('window').width * .08,
        borderRadius: 10
    },
    post: {
        fontSize: Dimensions.get('window').height * .016,
        color: Color.WHITE,
        textAlign: "center",
        fontFamily: "QuicksandMedium",
    },
    dateRow: {
        marginTop: Dimensions.get('window').height * .02, 
        marginHorizontal: Dimensions.get('window').width * .05,
        flexDirection: 'row'
    },
    dateContainer: {
        flex: 1,
        paddingVertical: Dimensions.get('window').height * .03,
        paddingHorizontal: Dimensions.get('window').width * .04,
        shadowColor: 'rgba(0,0,0,.4)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 5,
        borderRadius: 5,
        backgroundColor: Color.WHITE
    },
    item: {
        alignSelf: 'flex-start'
    },
    date: {
        color: Color.HEADER,
        fontFamily: "QuicksandSemiBold",
        fontSize: Dimensions.get('window').height * .018, 
    },
    bottomTitle: {
        fontFamily: "QuicksandMedium",
        color: Color.HEADER,
        fontSize: Dimensions.get('window').height * .015, 
        marginBottom: Dimensions.get('window').height * .018, 
    },
    helpButton: {
        position: 'absolute',
        top: Dimensions.get('window').height * .01,
        right: Dimensions.get('window').height * .01,
    },
    helpIcon: {
        fontSize: Dimensions.get('window').height * .02,
        color: Color.TEXT,
        opacity: .7
    }
});

export default ChatModalComponent;