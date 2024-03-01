import React from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import * as Color from '../../../global/colors'
import { LinearGradient } from 'expo-linear-gradient';
import ScaleView from "../general/ScaleView";

// Modal if you want to just display a text pop up
const GeneralTextModal = ({modalVisible, setModalVisible, text, buttonText}) => {

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
                    <Text style={styles.modalText}>{text}</Text>
                    <View style={{flexDirection: 'row', borderRadius: 5, overflow: 'hidden'}}>
                    <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.textStyle}>{buttonText}</Text>
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
    backgroundColor: 'rgba(0,0,0,.7)'
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
    padding: Dimensions.get('window').height * .015,
    marginBottom: Dimensions.get('window').height * .02,
    elevation: 2,
    flex: 1,
    marginHorizontal: Dimensions.get('window').width * .1,
    backgroundColor: Color.WHITE,
    borderColor: Color.MAIN,
    borderWidth: 1,
    borderRadius: 10
  },
  textStyle: {
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
    fontFamily: 'QuicksandSemiBold',
    marginTop: Dimensions.get('window').height * .03,
    marginBottom: Dimensions.get('window').height * .05,
  }
});

export default GeneralTextModal;