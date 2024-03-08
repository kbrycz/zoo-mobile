import React from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator } from "react-native";
import * as Color from '../../../global/colors'
import { LinearGradient } from 'expo-linear-gradient';
import ScaleView from "../general/ScaleView";

// Modal that pops up when you want to move forward in journey
const MoveForwardModalComponent = ({modalError, loadingData, modalExitVisible, setModalExitVisible, header, sub, buttonText, buttonFunc}) => {

  return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalExitVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalExitVisible(!modalExitVisible);
            }}>
            <View style={styles.centeredView}>
              <ScaleView>
                <View style={styles.modalView}>               
                    <Text style={styles.modalText}>{header}</Text>
                    <Text style={styles.sub}>{sub}</Text>
                  
                    {
                        modalError
                        ? <Text style={styles.errorMessage}>There was a problem with your request!</Text>
                        : null
                    }
                    <View style={{flexDirection: 'row', borderRadius: 5, overflow: 'hidden'}}>
                    {
                      loadingData
                      ? <View style={[styles.button, styles.buttonClose2]}>
                          <ActivityIndicator
                                animating={true}
                                size="small"
                                color={Color.MAIN}
                            />
                        </View>
                      : <LinearGradient style={[styles.button, styles.buttonClose2]} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                          <TouchableOpacity onPress={buttonFunc}>
                            <Text style={styles.textStyle2}>{buttonText}</Text>
                          </TouchableOpacity>
                        </LinearGradient>
                    }
                        <TouchableOpacity
                        disabled={loadingData}
                        style={[styles.button, styles.buttonClose1]}
                        onPress={() => setModalExitVisible(false)}>
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
    marginBottom: Dimensions.get('window').height * .02,
  },
  sub: {
    marginHorizontal: Dimensions.get('window').width * .05,
    textAlign: 'justify',
    color: Color.HEADER,
    opacity: .5,
    fontSize: Dimensions.get('window').height * .014,
    lineHeight: Dimensions.get('window').height * .03,
    fontFamily: 'QuicksandMedium',
    marginBottom: Dimensions.get('window').height * .03,
  },
  errorMessage: {
    marginBottom: Dimensions.get('window').height * .03,
    textAlign: 'center',
    fontSize: Dimensions.get('window').height * .015,
    color: Color.ERROR,
    fontFamily: "QuicksandMedium"
}
});

export default MoveForwardModalComponent;