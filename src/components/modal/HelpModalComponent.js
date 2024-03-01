import React from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import * as Color from '../../../global/colors'
import { LinearGradient } from 'expo-linear-gradient';
import ScaleView from "../general/ScaleView";

// Modal for a help box
const HelpModalComponent = ({modalVisible, setModalVisible, text, sub}) => {

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
                    <Text style={styles.modalSub}>{sub}</Text>
                    <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.textStyle}>Close</Text>
                      </TouchableOpacity>
                    </LinearGradient>
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
    width: Dimensions.get('window').width * .6,
    marginHorizontal: Dimensions.get('window').width * .05,
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
});

export default HelpModalComponent;