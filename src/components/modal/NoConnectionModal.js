import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator, Image } from "react-native";
import * as Color from '../../../global/colors'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import ScaleView from "../general/ScaleView";

// If the user is unable to connect to the server, gives them a modal to let them try again
const NoConnectionModal = ({modalVisible, setModalVisible, testConnection}) => {

  // Variables for modal
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(false)
  const [closeCount, setCloseCount] = useState(0)

  // Tries to connect again from the retry function passed in
  const retryTemp = async () => {
    setLoading(true)
    setMessage(false)
    let response = await testConnection()
    if (!response) {
      setTimeout(() => {
        setLoading(false)
        setMessage(true)
        setCloseCount(closeCount + 1)
      }, 1000);
    }
    else {
      setTimeout(() => {
        setLoading(false)
        setMessage(false)
        setModalVisible(false)
      }, 1000);
    }
    
  }

  // Runs every time the modal opens
  useEffect(() => {
    setLoading(false)
    setMessage(false)
  }, [modalVisible]);
    
  return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
                <ScaleView>
                  <View style={styles.modalView}>
                  <View style={styles.noPostsContainer}>
                      <View style={styles.imageContainer}>
                          <Image
                          style={styles.image} 
                          source={require('../../../assets/general/sadFace.png')}
                          />
                      </View>
                      {
                        closeCount < 5
                        ? <>
                            <Text style={styles.noPosts}>We're having an issue connecting to the server!</Text>
                            {
                                !loading
                                ? (<LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                                      <TouchableOpacity onPress={retryTemp}>
                                          <Text style={styles.buttonText}>Try again</Text>
                                      </TouchableOpacity>
                                    </LinearGradient>)
                                : <ActivityIndicator size="large" color={Color.MAIN} />
                            }
                            {
                                message
                                ? <Text style={styles.message}>That didn't work!</Text>
                                : null
                            }
                          </>
                        : <Text style={styles.noPosts}>Too many attempts. Please try resetting the app or fixing your internet!</Text>
                      }

                  </View>
                  </View>
                </ScaleView>
                
            </View>
        </Modal>
  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.7)",
    zIndex: 1000
  },
  noPostsContainer: {
    backgroundColor: Color.WHITE,
    height: Dimensions.get('window').height * .6,
    marginHorizontal: Dimensions.get('window').width * .05,
    width: Dimensions.get('window').width * .9,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000
  },
  imageContainer: {
    marginTop: -Dimensions.get('window').height * .05,
    width: Dimensions.get('window').width * .32,
    height: Dimensions.get('window').height * .22,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode:'contain',
  },
  noPosts: {
    fontFamily: 'QuicksandBold',
    textAlign: 'center',
    marginHorizontal: Dimensions.get('window').width * .1,
    fontSize: Dimensions.get('window').height * .02,
    color: Color.MAIN,
    lineHeight: Dimensions.get('window').height * .04,
    marginBottom: Dimensions.get('window').height * .05,
  },
  button: {
    marginHorizontal: Dimensions.get('window').width * .1,
    width: Dimensions.get('window').width * .6,
    borderRadius: 5,
    padding: Dimensions.get('window').height * .02,
    zIndex: 2000
  },
  buttonText: {
    fontSize: Dimensions.get('window').height * .015,
    textAlign: 'center',
    fontFamily: "QuicksandBold",
    color: Color.WHITE,
    zIndex: 2000
  },
  message: {
    marginTop: Dimensions.get('window').height * .025,
    fontSize: Dimensions.get('window').height * .015,
    textAlign: 'center',
    fontFamily: "QuicksandMedium",
    color: Color.ERROR,
  }
});

export default NoConnectionModal;