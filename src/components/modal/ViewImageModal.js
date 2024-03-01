import React from "react";
import { Alert, Modal, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import ImageZoom from 'react-native-image-pan-zoom';
import { serverName } from "../../api/serverName";
import * as Color from '../../../global/colors'
import BetterImage from "../general/BetterImage";

// Modal to view an image in full screen
const ViewImageModal = ({viewModalVisible, setViewModalVisible, image, isLocal}) => {
    
  return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={viewModalVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setViewModalVisible(!viewModalVisible);
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <TouchableOpacity style={styles.backIconContainer} onPress={() => setViewModalVisible(!viewModalVisible)}>
                  <Feather name="x" style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.imageView}>
                    <ImageZoom
                        enableSwipeDown
                       onSwipeDown={() => setViewModalVisible(false)}
                       cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={Dimensions.get('window').width}
                       imageHeight={Dimensions.get('window').height}>
                         {
                           isLocal
                           ? <BetterImage resizeMode="contain" style={styles.image} source={{uri: image}} />
                           : <BetterImage resizeMode="contain" style={styles.image} source={{uri: serverName + image}} />
                         }
                        
                    </ImageZoom>
                </View>
            </View>
            </View>
        </Modal>
  );
};

const styles = StyleSheet.create({
  
    modalView: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: Color.WHITE,
      elevation: 5,
      backgroundColor: Color.BLACK
    },
    backIcon: {
      fontSize: Dimensions.get('window').height * .022,
      color: Color.WHITE
    },
    backIconContainer: {
      position: 'absolute',
      top: 50,
      right: 20,
      fontSize: Dimensions.get('window').height * .018,
      zIndex: 10
    },
    imageView: {
      alignItems: 'center',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 5,
  },
});

export default ViewImageModal;