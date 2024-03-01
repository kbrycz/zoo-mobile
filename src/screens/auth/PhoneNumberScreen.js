import * as React from 'react';
import { View, Dimensions, StyleSheet, 
        Text, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import * as Color from '../../../global/colors'
import { Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import PhoneInput from 'react-native-phone-input';
import { LinearGradient } from 'expo-linear-gradient';
import HideKeyboard from '../../components/general/HideKeyboard';
import api from '../../api/server'
import HelpModalComponent from '../../components/modal/HelpModalComponent';

// Screen to enter your phone number for login or signup
class PhoneNumberScreen extends React.Component {

  // Initialize the Phone number Screen state
  constructor() {
    super()
    this.state = {
      errorMessage: false,
      loading: true,
      loadingData: false,
      valid: "",
      value: "",
      hasAlreadySent: false,
      helpModalVisible: false
    }
    this.checkIfValid = this.checkIfValid.bind(this);
  } 

  // Updates the phone number variables based on ref data
  updateInfo() {
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    });
  }

  // Loads everything when the component loads
  componentDidMount() {
    this.loadEverything()
  }

  // Sets the help modal visible for no code
  setHelpModalVisible = (isVis) => {
    this.setState({helpModalVisible: isVis})
  }

  // Loads all of the asyncs before showing page
  loadEverything = async () => {
    // Loads all the fonts
    await Font.loadAsync({
      'QuicksandMedium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
      'QuicksandSemiBold': require('../../../assets/fonts/Quicksand-SemiBold.ttf'),
      'QuicksandBold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    });

    this.setState({
        loading: false,
    })
  }

  // When phone number changes, format it properly
  onChangePhoneNumber = (number) => {
      this.setState({errorMessage: "", hasAlreadySent: false})
      let num = number.split(' ')
      if (num.length > 1) {
          let secondNum = num[1]
          let lastNum = secondNum.split('-')
          if (lastNum.length > 2) {
              let lastFour = lastNum[2]
              if (lastFour.length > 4) {
                  return
              }
          }
      }
  }

  // Check if number is valid and send to next screen
  checkIfValid = async () => {
    this.setState({errorMessage: ''})
    if (!this.phone.isValidNumber()) {
      this.setState({
        errorMessage: "Please enter a valid phone number"
      })
    }
    else {
      // Disable when not testing DEV ONLY
      this.setState({
        errorMessage: "",
        loadingData: false
      })
      this.props.navigation.navigate('VerifyPhoneScreen', {number: this.phone.getValue()})
      return

      if (this.state.hasAlreadySent) {
        console.log("Sent already")
        this.setState({
          errorMessage: "",
          loadingData: false,
        })
        this.props.navigation.navigate('VerifyPhoneScreen', {number: this.phone.getValue()})
        return
      }

      this.setState({loadingData: true})
      try {
        let config = {
            params: {
                phone: this.phone.getValue()
            },
        }
        // Sends phone to server to get verify token
        const response = await api.get('/twilioVerify', config)
        if (!response || !response.data.isGood) {
          throw "Unable to log into app!"
        }
        this.setState({
          errorMessage: "",
          loadingData: false,
          hasAlreadySent: true
        })
        this.props.navigation.navigate('VerifyPhoneScreen', {number: this.phone.getValue()})
      } 
      catch (err) {
        console.log(err.message)
        this.setState({
          errorMessage: 'Unable to log into app. Please try again later',
          loadingData: false,
        })
      }
    }
  }

  // Renders the jsx for the UI
  render() {
    // If the component is still loading
    if (this.state.loading) {
      return <LoadingIndicator loadingData={this.state.loading} />
    }

    // Component is done loading
    return (
      <HideKeyboard>
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
          <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
          <HelpModalComponent modalVisible={this.state.helpModalVisible} setModalVisible={this.setHelpModalVisible} text={"Number Not Working?"} sub={"Sorry to hear that! We might be having an issue verifying your phone number is legit! Make sure you have selected the correct area code (+1 for US)! If it is still not accepting your number, message us at contact@bryczzoo.org and we will resolve this issue quickly!"} />
            <View style={styles.backView}>
                <TouchableOpacity onPress={this.props.navigation.goBack}>
                    <Ionicons  name="chevron-back" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                  <Text style={styles.headerText}>What's your phone number?</Text>
                  <Text style={styles.sub}>This will never be shared with anyone!</Text>
            </View>
            <View style={styles.whiteContainer}>
              <View style={styles.line} />
              <View style={styles.container}>
                <View style={styles.whiteBackground}>
                  <PhoneInput
                        onChangePhoneNumber={this.onChangePhoneNumber}
                        accessibilityLabel={"Phone number"}
                        allowZeroAfterCountryCode={false}
                        autoFormat
                        initialCountry={'us'}
                        style={styles.input}
                        maxLength={10}
                        textStyle={{
                            fontSize: Dimensions.get('window').height * .03,
                            color: Color.MAIN,
                            height: Dimensions.get('window').height * .04,
                            fontFamily: "QuicksandBold",
                        }}
                        textProps={{
                            maxLength: 17,
                            autoFocus: true,
                            
                        }}
                        confirmTextStyle={{
                            fontSize: Dimensions.get('window').height * .018,
                            color: Color.MAIN,
                            padding: 10,
                            fontFamily: "QuicksandBold",
                            
                        }}
                        cancelTextStyle={{
                            fontSize: Dimensions.get('window').height * .018,
                            color: Color.MAIN,
                            padding: 10,
                            fontFamily: "QuicksandBold",
                        }}
                        ref={ref => {
                            this.phone = ref;
                        }}
                    />
                </View>
                  {
                      this.state.loadingData
                      ? <ActivityIndicator
                              animating={true}
                              size="small"
                              color={Color.MAIN}
                        />
                      : null
                  }
                  {
                    this.state.errorMessage.length > 0
                    ? <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                    : null
                  }
                  <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                    <TouchableOpacity onPress={this.checkIfValid} disabled={this.state.loadingData}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <TouchableOpacity onPress={() => this.setHelpModalVisible(true)}>
                    <Text style={styles.noCode}>Number not working?</Text>
                  </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </HideKeyboard>
      )
  }
}

const styles = StyleSheet.create({
    grad: {
      height: Dimensions.get('window').height
    },
    whiteBackground: {
      marginVertical: Dimensions.get('window').height * .02,
      paddingVertical: Dimensions.get('window').height * .03,
      paddingHorizontal: Dimensions.get('window').width * .02,
      backgroundColor: Color.WHITE,
      marginHorizontal: Dimensions.get('window').width * .05,
      width: Dimensions.get('window').width * .9,
      borderRadius: 5,
      shadowColor: Color.BLACK,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
      elevation: 2,
  },
    container: {
        marginTop: Dimensions.get('window').height * .02,
        marginHorizontal: Dimensions.get('window').width * .05,
        alignItems: 'center'
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
    button: {
      marginTop: Dimensions.get('window').height * .03,
      marginBottom: Dimensions.get('window').height * .02,
      marginHorizontal: Dimensions.get('window').width * .05,
      width: Dimensions.get('window').width * .8,
      borderRadius: 5,
      padding: Dimensions.get('window').height * .02,
    },
    buttonText: {
        fontSize: Dimensions.get('window').height * .015,
        textAlign: 'center',
        fontFamily: "QuicksandBold",
        color: Color.WHITE,
    },
    input: {
        paddingVertical: Dimensions.get('window').height * .03,
        marginHorizontal: Dimensions.get('window').height * .02,
        borderBottomWidth: 1,
        borderColor: Color.LIGHT_BORDER,
    },
    textContainer: {
        marginTop: Dimensions.get('window').height * .05,
        marginHorizontal: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .05,
    },
    view: {
        marginTop: Dimensions.get('window').height * .02,
        paddingBottom: Dimensions.get('window').height * .05
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
    sub: {
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
    errorMessage: {
        marginTop: Dimensions.get('window').height * .015,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .015,
        color: Color.ERROR,
        fontFamily: "QuicksandMedium"
    },
    noCode: {
      marginTop: Dimensions.get('window').height * .015,
      textAlign: 'center',
      fontSize: Dimensions.get('window').height * .013,
      color: Color.MAIN,
      fontFamily: "QuicksandSemiBold",
      opacity: .5
    }
})

export default PhoneNumberScreen