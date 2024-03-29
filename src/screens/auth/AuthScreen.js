import * as React from 'react';
import { View, Dimensions, StyleSheet, 
        Text, SafeAreaView, Image, Linking, ImageBackground} from 'react-native';
import * as Font from 'expo-font';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import * as Color from '../../../global/colors'
import { FontAwesome } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

// Opening auth screen where user chooses login or sign up method
class AuthScreen extends React.Component {

  // Initialize the Auth Screen state
  constructor() {
    super()
    this.state = {
      errorMessage: '',
      loading: true,
    }
  } 

  // Load everything when component loads
  componentDidMount() {
    this.loadEverything()
  }

  // Loads all of the asyncs before showing page
  loadEverything = async () => {
    // Loads all the fonts
    await Font.loadAsync({
        'QuicksandMedium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
        'QuicksandSemiBold': require('../../../assets/fonts/Quicksand-SemiBold.ttf'),
        'QuicksandBold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    });

    this.setState({loading: false})
  }

  // Go to phone number screen
  goToPhoneScreen = () => {
      this.props.navigation.navigate('PhoneNumberScreen')
  }

  // Renders the jsx for the UI
  render() {
    if (this.state.loading) {
      return <LoadingIndicator loadingData={this.state.loading} />
    }
    return (
        // linear-gradient(137.05deg, #9A90D2 1.85%, #554B8B 86.92%)
        <ImageBackground
            source={require('../../../assets/auth/background.jpg')}
            style={styles.grad}
            blurRadius={5}>
            <View style={styles.darkOverlay}>
                <SafeAreaView style={styles.sv}>
                    <View style={styles.view} behavior='position' >
                        <View style={styles.imageContainer}>
                            <Image
                            style={styles.image} 
                            source={require('../../../assets/auth/light-logo.png')}
                            />
                        </View>
                        <Text style={styles.motto}>Start Your Adventure Today</Text>
                    </View>
                    <View style={styles.bottomPortion}>
                        <TouchableOpacity style={styles.button} onPress={this.goToPhoneScreen}>
                            <FontAwesome name="phone" style={styles.icon} />
                            <Text style={styles.buttonText}>Continue with phone number</Text>
                        </TouchableOpacity>
                        <Text style={styles.terms}>By continuing, you agree to our 
                        <Text style={{color: 'rgba(255,255,255,0.7)'}}
                            onPress={() => {Linking.openURL('https://pebbleapp.io/terms')}}> terms of service</Text> 
                        ! Check how we handle your data in our 
                        <Text style={{color: 'rgba(255,255,255,0.7)'}}
                            onPress={() => {Linking.openURL('https://pebbleapp.io/privacy-policy')}}> privacy policy</Text> 
                        .</Text>
                    </View>
                </SafeAreaView>
            </View>
        </ImageBackground>
      )
  }
}

const styles = StyleSheet.create({
    grad: {
        flex: 1,
        width: null,
        height: null,
    },
    darkOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sv: {
        height: Dimensions.get('window').height
    },
    motto: {
        marginHorizontal: Dimensions.get('window').width * .18,
        fontSize: Dimensions.get('window').height * .02,
        lineHeight: Dimensions.get('window').height * .045,
        textAlign: 'center',
        fontFamily: "QuicksandSemiBold",
        color: Color.WHITE,
        marginTop: -Dimensions.get('window').height * .12,
    },
    bottomPortion: {
        position: 'absolute',
        bottom: Dimensions.get('window').height * .12,
    },
    view: {
        marginTop: Dimensions.get('window').height * .12,
        paddingBottom: Dimensions.get('window').height * .05,
    },
    button: {
        marginTop: Dimensions.get('window').height * .02,
        padding: Dimensions.get('window').height * .015,
        marginHorizontal: Dimensions.get('window').width * .1,
        borderRadius: 5,
        padding: Dimensions.get('window').height * .02,
        backgroundColor: "#F2F0F9",
    },
    buttonText: {
        fontSize: Dimensions.get('window').height * .014,
        textAlign: 'center',
        fontFamily: "QuicksandBold",
        color: Color.MAIN,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .025,
        color: Color.MAIN,
        position: 'absolute',
        top: "100%",
        left: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    terms: {
        textAlign: 'center',
        marginTop: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandMedium',
        marginHorizontal: Dimensions.get('window').width * .1,
        lineHeight: Dimensions.get('window').height * .025,
        fontSize: Dimensions.get('window').height * .013,
        color: 'rgba(255,255,255,0.5)'
    },
    imageContainer: {
        width: Dimensions.get('window').width * .64,
        marginLeft: Dimensions.get('window').width * .18,
        marginRight: Dimensions.get('window').width * .18,
        height: Dimensions.get('window').height * .4,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode:'contain',
    },
})

export default AuthScreen