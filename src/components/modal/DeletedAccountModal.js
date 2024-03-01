import React from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Image } from "react-native";
import * as Color from '../../../global/colors'
import { LinearGradient } from 'expo-linear-gradient';
import ScaleView from "../general/ScaleView";

// If the user is having issues with account or it was deleted
const DeletedAccountModal = ({modalVisible, setModalVisible, logOut}) => {
    
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
                      <Text style={styles.noPosts}>There is an issue accessing your account!</Text>
                      <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                        <TouchableOpacity onPress={logOut}>
                            <Text style={styles.buttonText}>Log Out</Text>
                        </TouchableOpacity>
                      </LinearGradient>
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
    backgroundColor: "rgba(0,0,0,.7)"
  },
  noPostsContainer: {
    backgroundColor: Color.WHITE,
    height: Dimensions.get('window').height * .6,
    marginHorizontal: Dimensions.get('window').width * .05,
    width: Dimensions.get('window').width * .9,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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
  },
  buttonText: {
    fontSize: Dimensions.get('window').height * .015,
    textAlign: 'center',
    fontFamily: "QuicksandBold",
    color: Color.WHITE,
  },
});

export default DeletedAccountModal;