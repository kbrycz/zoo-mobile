import React from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ScaleView from "../general/ScaleView";
import * as Color from "../../../global/colors"

// Modal that pops up for android actions
const AndroidActionModal = ({modalVisible, setModalVisible, androidActionIndex, androidActionProcess, deletePhoto, viewPhoto, deletePrompt, saveMeme}) => {

  // Delete function that handles the right option
  const tempDeleteFunc = () => {
    if (androidActionProcess === 1) {
        deletePhoto(androidActionIndex)
        setModalVisible(false)
    }
    else if (androidActionProcess === 3) {
      saveMeme(null)
      setModalVisible(false)
    }
    else {
        deletePrompt(androidActionIndex)
        setModalVisible(false)
    }
  }

  // View the photo
  const tempView = () => {
      if (androidActionProcess < 2) {
          viewPhoto(androidActionIndex)
          setModalVisible(false)
      }
  }

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
                    <Text style={styles.modalText}>Actions</Text>
                
                    <View style={{flexDirection: 'row', borderRadius: 5, overflow: 'hidden'}}>
                    {
                        androidActionProcess > 0
                        ?   <LinearGradient style={[styles.button, styles.buttonClose2]} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                                <TouchableOpacity onPress={tempDeleteFunc}>
                                    <Text style={styles.textStyle2}>Delete</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        : null
                    }
                    {
                        androidActionProcess < 2 || androidActionProcess === 3
                        ?   <LinearGradient style={[styles.button, styles.buttonClose2]} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                                <TouchableOpacity onPress={tempView}>
                                    <Text style={styles.textStyle2}>View</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        : null
                    }
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose1]}
                        onPress={() => setModalVisible(false)}>
                        <Text style={styles.textStyle1}>Cancel</Text>
                    </TouchableOpacity>

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
    backgroundColor: 'rgba(0,0,0,.7)'
  },
  modalView: {
    width: Dimensions.get('window').width * .8,
    marginRight: Dimensions.get('window').width * .1,
    marginLeft: Dimensions.get('window').width * .1,
    backgroundColor: Color.WHITE,
    borderRadius: 10,
    padding: Dimensions.get('window').height * .025,
    paddingVertical: Dimensions.get('window').height * .04,
    alignItems: "center",
  },
  button: {
    padding: Dimensions.get('window').height * .015,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5
  },
  buttonClose1: {
    backgroundColor: Color.WHITE,
    borderColor: Color.MAIN,
    borderWidth: 1,
    borderRadius: 10
  },
  buttonClose2: {
    borderRadius: 10
  },
  textStyle1: {
    textAlign: "center",
    fontFamily: 'QuicksandSemiBold',
    color: Color.MAIN,
    fontSize: Dimensions.get('window').height * .016,
  },
  textStyle2: {
    textAlign: "center",
    fontFamily: 'QuicksandSemiBold',
    color: Color.WHITE,
    fontSize: Dimensions.get('window').height * .016,
  },
  modalText: {
    textAlign: 'center',
    color: Color.MAIN,
    fontSize: Dimensions.get('window').height * .024,
    lineHeight: Dimensions.get('window').height * .045,
    fontFamily: 'QuicksandBold',
    marginBottom: Dimensions.get('window').height * .03,
  },
});

export default AndroidActionModal;