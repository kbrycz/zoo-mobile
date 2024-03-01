import * as React from 'react';
import { View, Dimensions, StyleSheet, 
        Text, SafeAreaView, Platform, StatusBar} from 'react-native';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import * as Color from '../../../global/colors'
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import HelpModalComponent from '../../components/modal/HelpModalComponent';

// Screen to enter your relationship preferences and gender
class EnterPreferencesScreen extends React.Component {

  // Initialize the Preferences Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
      loadingData: false,
      status: true,
      gender: -1,
      helpModalVisible: false,
      header: '',
      sub: ''
    }
  } 

  // Loads everything when the component loads
  componentDidMount() {
    this.loadEverything()
  }

  // Sets the helper modal visible
  setHelpModalVisible = (isVis) => {
      this.setState({helpModalVisible: isVis})
  }

  // Loads all of the asyncs before showing page
  loadEverything = async () => {
    this.setState({
        loading: false,
    })
  }

  // Highlights the bubble that is pressed
  getHighlighted = (current, compare) => {
    if (compare === current) {
        return {
            borderColor: Color.MAIN,
            borderWidth: 2
        }
    }
  }

  // Opens the help modal
  openHelp = () => {
    this.setState({
        header: "Which Best Identifies You?",
        sub: "Please answer this question as it provides useful data for us to see who is using our app and how we can make it more inclusive for everyone!"
    }, () => {
        this.setHelpModalVisible(true)
    })
  }

  // Changes highlighted bubbles text to purple and resets margin
  getHighlightedText = (current, compare) => {
    if (compare === current) {
        return {
            color: Color.MAIN,
            marginBottom: 0
        }
    }
  }

  // Sends user to the geo screen
  nextPage = () => {
    let obj = {
        first: this.props.route.params.first,
        last: this.props.route.params.last,
        birthdate: this.props.route.params.birthdate,
        number: this.props.route.params.number,
        status: this.state.status,
        gender: this.state.gender,
        interested: this.state.interested
    }
    this.props.navigation.navigate('EnterZipScreen', obj)
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
          <HelpModalComponent modalVisible={this.state.helpModalVisible} setModalVisible={this.setHelpModalVisible} text={this.state.header} sub={this.state.sub} />
          <View style={styles.backView}>
              <TouchableOpacity onPress={this.props.navigation.goBack}>
                  <Ionicons  name="chevron-back" style={styles.icon} />
              </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
                <Text style={styles.headerText}>Just a little bit more</Text>
          </View>
          <View style={styles.whiteContainer}>
            <View style={styles.line} />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.whiteBackground}>
                    <Text style={styles.question}>Which best identifies you?  <TouchableOpacity onPress={() => this.openHelp()}><Ionicons name="help-circle-outline" style={styles.helpIcon} /></TouchableOpacity></Text>
                    <View style={styles.takenContainer}>
                        <TouchableOpacity style={[styles.genderButton, this.getHighlighted(0, this.state.gender)]} onPress={() => this.setState({gender: 0})}>
                            <Text style={[styles.takenButtonText, this.getHighlightedText(0, this.state.gender)]}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.genderButton, this.getHighlighted(1, this.state.gender), {marginHorizontal: Dimensions.get('window').height * .015}]} onPress={() => this.setState({gender: 1})}>
                            <Text style={[styles.takenButtonText, this.getHighlightedText(1, this.state.gender)]}>Female</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.genderButton, this.getHighlighted(2, this.state.gender)]} onPress={() => this.setState({gender: 2})}>
                            <Text style={[styles.takenButtonText, this.getHighlightedText(2, this.state.gender)]}>Other</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    this.state.gender < 0
                    ?   <View style={[styles.button, styles.button2]}>
                            <Text style={[styles.buttonText, styles.buttonText2]}>Continue</Text>
                        </View>
                    :   <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                            <TouchableOpacity onPress={this.nextPage}>
                                <Text style={styles.buttonText}>Continue</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                }
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
        marginTop: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').height * .04,
        paddingHorizontal: Dimensions.get('window').width * .06,
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
        marginTop: Dimensions.get('window').height * .04,
        marginBottom: Dimensions.get('window').height * .3,
        marginHorizontal: Dimensions.get('window').width * .1,
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
        borderWidth: 1,
        borderColor: "rgba(0,0,0,.1)",
        backgroundColor: "#rgba(0,0,0,0)"
    },
    buttonText2: {
        color: "rgba(0,0,0,.1)"
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
    backView: {
        marginTop: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').height * .015,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .035,
        color: Color.WHITE
    },
    question: {
        marginBottom: Dimensions.get('window').height * .03,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.HEADER
    },
    takenContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    takenButtonText: {
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .015,
        textAlign: 'center',
        color: Color.HEADER,
        marginBottom: 2
    },
    genderButton: {
        width: Dimensions.get('window').width * .7 / 3,
        padding: Dimensions.get('window').height * .018,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.1)'
    },
    helpIcon: {
        fontSize: Dimensions.get('window').height * .018,
        color: Color.HEADER,
        opacity: .5
    }
})

export default EnterPreferencesScreen