import * as React from 'react';
import { View, Dimensions, StyleSheet, 
        Text, SafeAreaView, Platform, StatusBar, ActivityIndicator} from 'react-native';
import api from '../../api/server'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import * as Color from '../../../global/colors'
import { Ionicons   } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import CodeBoxComponent from '../../components/auth/CodeBoxComponent';
import { LinearGradient } from 'expo-linear-gradient';
import HideKeyboard from '../../components/general/HideKeyboard';
import HelpModalComponent from '../../components/modal/HelpModalComponent';

// Screen to verify your phone number with given code
class VerifyPhoneScreen extends React.Component {

  // Initialize the Signup Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
      loadingData: false,
      number: "",
      code: "",
      errorMessage: "",
      alreadyGood: false,
      tries: 0,
      helpModalVisible: false
    }
  } 

  // Load everything when component loads
  componentDidMount() {
    this.loadEverything()
  }

  // Loads all data from navigation
  loadEverything = async () => {
    this.setState({
        number: this.props.route.params.number,
        loading: false,
    })
  }

  // Sets the code to val
  setCode = (val) => {
      this.setState({code: val, errorMessage: ""})
  }

  // Sets the value of the connection modal
  setConnectionModalVisible = (isVis) => {
    this.setState({connectionModalVisible: isVis})
  }

  // Sets the help modal visible for no code
  setHelpModalVisible = (isVis) => {
    this.setState({helpModalVisible: isVis})
  }

  // Make sure code matches up and then either login or signup user
  submitCode = async () => {
      this.setState({errorMessage: "", loadingData: true})

      // Check if code matches the correct one
      if (this.state.code.length !== 5) {
        this.setState({errorMessage: "Code did not match!", loadingData: false})
        return
      }

      try {

        if (this.state.alreadyGood) {
          this.setState({
            loadingData: false,
            errorMessage: '',
          })
          this.props.navigation.navigate('EnterNameScreen', {number: this.state.number})
          return
        }

        // Send the users data to the server to see if they can create an account
        const response = await api.post('/handleAuth', {phone: this.state.number, code: this.state.code})

        if (!response) {
          throw "Error logging into app"
        }

        // Navigate to the main screen now that you are signed in
        if (response.data.newAccount) {
            console.log("User is creating a new account")
            // Reset error message 
            this.setState({
                loadingData: false,
                errorMessage: '',
                alreadyGood: true
            })
            this.props.navigation.navigate('EnterNameScreen', {number: this.state.number})
        }
        else {
            console.log("Successfully logged into account")
              
            // Set the token in Async storage so user will log in automatically
            await AsyncStorage.setItem('token', response.data.token)
            // Reset error message 
            this.setState({
                loadingData: false
            })
            this.props.navigation.navigate('Main', {screen: 'Tab'})
        }
      } 
      catch (err) {
        console.log(err.message)
        if (this.state.tries > 3) {
          this.setState({
            errorMessage: 'Too many attempts. Restart the app to try again!',
            loadingData: false,
            tries: this.state.tries + 1
          })
        } 
        else {
          this.setState({
            errorMessage: 'Unable to log into app. Please try again later',
            loadingData: false,
            tries: this.state.tries + 1
          })
        }
      }
  }

  // Renders the jsx for the UI
  render() {
    if (this.state.loading) {
      return <LoadingIndicator loadingData={this.state.loading} />
    }
    return (
      <HideKeyboard>
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
          <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
            <HelpModalComponent modalVisible={this.state.helpModalVisible} setModalVisible={this.setHelpModalVisible} text={"Didn't Receive Code?"} sub={"Sorry to hear that! If it has been at least 5 minutes, close and restart the app to try again! If you are still having issues, please contact our support team at contact@bryczzoo.org!"} />
            <View style={styles.backView}>
                <TouchableOpacity onPress={this.props.navigation.goBack}>
                    <Ionicons  name="chevron-back" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                  <Text style={styles.headerText}>Let's make sure it's you</Text>
                  <Text style={styles.sub}>Please enter the verification code</Text>
            </View>
            <View style={styles.whiteContainer}>
              <View style={styles.line} />
              <View style={styles.container}>
                <View style={styles.whiteBackground}>
                  <CodeBoxComponent value={this.state.code} setValue={this.setCode} />
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
                    this.state.errorMessage !== ""
                    ? <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                    : null
                  }
                  <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                    <TouchableOpacity onPress={this.submitCode} disabled={this.state.loadingData || this.state.tries > 4}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <TouchableOpacity onPress={() => this.setHelpModalVisible(true)}>
                    <Text style={styles.noCode}>Didn't receive code?</Text>
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
      width: Dimensions.get('window').width * .18,
      marginHorizontal: Dimensions.get('window').width * .39,
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
      marginTop: Dimensions.get('window').height * .02,
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

export default VerifyPhoneScreen