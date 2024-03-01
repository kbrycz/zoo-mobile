import * as React from 'react';
import { View, Dimensions, StyleSheet, 
        Text, SafeAreaView, ScrollView, Platform, StatusBar, ActivityIndicator} from 'react-native';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import * as Color from '../../../global/colors'
import { Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/server'
import AsyncStorage from '@react-native-async-storage/async-storage';
import GeneralTextModal from '../../components/modal/GeneralTextModal';
import LottieView from 'lottie-react-native';

// Screen to enter your final page for sign up
class FinalPageScreen extends React.Component {

  // Initialize the Final Page Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
      loadingData: false,
      first: '',
      modalVisible: false,
      errorMessage: false,
    }
  } 

  // Loads everything when the component loads
  componentDidMount() {
    this.loadEverything()
  }

  // Loads all of the asyncs before showing page
  loadEverything = async () => {
    this.setState({loading: false})
  }

  // Signs the user up and sends them to home screen
  getStarted = async () => {
    this.setState({loadingData: true, errorMessage: false})
    try {
    //   // Send the users data to the server to see if they can create an account
    //   let userObj = {
    //     first: this.props.route.params.first,
    //     last: this.props.route.params.last,
    //     birthdate: this.props.route.params.birthdate,
    //     number: this.props.route.params.number,
    //     showProfile: this.props.route.params.showProfile,
    //     gender: this.props.route.params.gender,
    //     interested: this.props.route.params.interested,
    //     photos: this.props.route.params.photos,
    //     about: this.props.route.params.about,
    //     interests: this.props.route.params.interests,
    //     location: this.props.route.params.location,
    //     job: this.props.route.params.job,
    //     hometown: this.props.route.params.hometown,
    //     education: this.props.route.params.education,
    //     prompts: this.props.route.params.prompts,
    //     meme: this.props.route.params.meme,
    //   }
    //   const response = await api.post('/signup', { userObj })

    //   if (!response || !response.data) {
    //       throw "Unable to sign up user at this time"
    //   }

    //   // Set the token in Async storage so user will log in automatically
    //   await AsyncStorage.setItem('token', response.data.token)

      // Reset error message 
      this.setState({
        loadingData: false,
        errorMessage: false
      })
      
      this.props.navigation.navigate('Main', {screen: 'DoneScreen'})
        
    } 
    catch (err) {
      console.log(err.message)
      this.setState({
        loadingData: false,
        errorMessage: true
      })
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
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
            <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
            <View style={styles.backView}>
                <TouchableOpacity onPress={this.props.navigation.goBack}>
                    <Ionicons name="chevron-back" style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                    <Text style={styles.headerText}>Ready to sign up?</Text>
            </View>
            <View style={styles.whiteContainer}>
                <View style={styles.line} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={styles.whiteBackground}>
                            <LottieView
                            autoPlay
                            loop
                                style={{
                                width: Dimensions.get('window').width * .7,
                                height: Dimensions.get('window').width * .7,
                                backgroundColor: 'rgba(0,0,0,0)',
                                }}
                                source={require('../../../assets/lottie/woman.json')}
                            />
                        </View>

                        {
                            this.state.errorMessage
                            ? <Text style={styles.errorMessage}>Something went wrong with signup</Text>
                            : null
                        }
                        {
                            this.state.loadingData
                            ? <ActivityIndicator
                                    style={styles.activity}
                                    animating={true}
                                    size="small"
                                    color={Color.MAIN}
                                />
                            : <View style={{marginBottom: Dimensions.get('window').height * .04}} />
                        }
                        {/* <Text style={styles.sub}>* You can always update your profile later!</Text> */}
                        <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                            <TouchableOpacity onPress={this.getStarted}>
                                <Text style={styles.buttonText}>Get Started</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    
                </ScrollView>
            </View>
            </SafeAreaView>
        </LinearGradient>

      )
  }
}

const styles = StyleSheet.create({
    grad: {
      height: Dimensions.get('window').height
    },
    whiteBackground: {
        paddingVertical: Dimensions.get('window').height * .02,
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
        marginTop: Dimensions.get('window').height * .05,
        marginHorizontal: Dimensions.get('window').width * .075,
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
    activity: {
        marginVertical: Dimensions.get('window').height * .03,
    },
    button: {
        zIndex: 2,
        marginHorizontal: Dimensions.get('window').width * .025,
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
    button2: {
        width: Dimensions.get('window').width * .8,
        marginTop: Dimensions.get('window').height * .02,
        marginHorizontal: Dimensions.get('window').width * .025,
        padding: Dimensions.get('window').height * .02,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Color.MAIN,
        marginBottom: Dimensions.get('window').height * .3,
    },
    buttonText2: {
        fontFamily: 'QuicksandBold',
        fontSize: Dimensions.get('window').height * .015,
        textAlign: 'center',
        color: Color.MAIN,
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
        textShadowRadius: 2,
    },
    backView: {
        marginTop: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').height * .015,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .035,
        color: Color.WHITE
    },
    sub: {
        marginTop: Dimensions.get('window').height * .1,
        fontSize: Dimensions.get('window').height * .012,
        color: "rgba(0,0,0,.2)",
        textAlign: "center",
        fontFamily: "QuicksandMedium"
    },
    errorMessage: {
        marginTop: Dimensions.get('window').height * .03,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .015,
        color: Color.ERROR,
        fontFamily: "QuicksandMedium"
    },
})

export default FinalPageScreen