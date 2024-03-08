import * as React from 'react';
import { StyleSheet, Dimensions, Text, TouchableOpacity,
         SafeAreaView, Linking, View, ScrollView, Platform, StatusBar, Image} from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Color from '../../../global/colors'

// Help screen to link to website and more details
class HelpScreen extends React.Component {
    
  // Initialize the Profile Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
    }
  } 

  // Loads everything when component loads
  componentDidMount() {
      this.loadEverything()
  } 

  // Load everything before loading screen
  loadEverything = async () => {
      console.log("loading everything for account")
      this.setState({loading: false})
  }

  // Sends user to terms of service page
  goToURL = (url) => {
    Linking.canOpenURL(url).then(supported => {
        if (supported) {
            Linking.openURL(url);
        } else {
            console.log("Don't know how to open URI: " + url);
        }
    });
  }
  
  // Renders the jsx for the UI
  render() {
    if (this.state.loading) {
        return <LoadingIndicator loadingData={this.state.loading} />
    }
    return (
      <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
            <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                <View style={styles.backView}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} disabled={this.state.loadingData}>
                        <Ionicons name="close-outline" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.headerText}>Help</Text>
                </View>
                <View style={styles.whiteContainer}>
                    <View style={styles.line} />
                    <ScrollView style={styles.sv}>
                        <View style={styles.mainContainer}>
                            <View style={styles.whiteBackground}>
                            <Text style={styles.category}>General</Text>
                                <TouchableOpacity style={styles.toggleContainer} 
                                    onPress={() => this.goToURL("https://pebbleapp.io/app")}>
                                    <Text style={styles.item}>Brycz Zoo Premium</Text>
                                    <View style={styles.switchView}>
                                        <AntDesign name="right" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toggleContainer} 
                                    onPress={() => this.goToURL("https://www.youtube.com/watch?v=0IvW1-xgLgE")}>
                                    <Text style={styles.item}>Intro Video</Text>
                                    <View style={styles.switchView}>
                                        <AntDesign name="right" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.whiteBackground}>
                                <Text style={styles.category}>Support</Text>
                                <TouchableOpacity style={[styles.toggleContainer, {borderTopWidth: 1}]} 
                                    onPress={() => this.goToURL("https://pebbleapp.io/safety")}>
                                    <Text style={styles.item}>Safety</Text>
                                    <View style={styles.switchView}>
                                        <AntDesign name="right" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toggleContainer} 
                                    onPress={() => this.goToURL("https://pebbleapp.io/app")}>
                                    <Text style={styles.item}>FAQ</Text>
                                    <View style={styles.switchView}>
                                        <AntDesign name="right" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toggleContainer}
                                    onPress={() => this.goToURL("https://pebbleapp.io/contact")}>
                                    <Text style={styles.item}>Contact</Text>
                                    <View style={styles.switchView}>
                                        <AntDesign name="right" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.whiteBackground}>
                                <Text style={styles.category}>More Information</Text>
                                <TouchableOpacity style={[styles.toggleContainer, {borderTopWidth: 1}]}
                                    onPress={() => this.goToURL("https://pebbleapp.io/about")}>
                                    <Text style={styles.item}>About Us</Text>
                                    <View style={styles.switchView}>
                                        <AntDesign name="right" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toggleContainer}
                                    onPress={() => this.goToURL("https://pebbleapp.io/about")}>
                                    <Text style={styles.item}>Meet the Team</Text>
                                    <View style={styles.switchView}>
                                        <AntDesign name="right" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.socialIconContainer}>
                                    <TouchableOpacity onPress={() => this.goToURL("https://instagram.com/pebble_app")}>
                                        <Image resizeMode='contain' style={styles.socialIcon} source={require('../../../assets/general/insta.png')}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.goToURL("https://twitter.com/pebble_app")}>
                                        <Image resizeMode='contain' style={styles.socialIcon} source={require('../../../assets/general/twitter.png')}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.goToURL("https://tiktok.com/@pebbleapp")}>
                                        <Image resizeMode='contain' style={styles.socialIcon} source={require('../../../assets/general/tiktok.png')}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
    whiteContainer: {
        backgroundColor: Color.BACKGROUND,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
    },
    whiteBackground: {
        marginTop: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').height * .04,
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
    mainContainer: {
        marginBottom: Dimensions.get('window').height * .4,
    },
    line: {
        marginTop: Dimensions.get('window').height * .03,
        width: Dimensions.get('window').width * .2,
        marginHorizontal: Dimensions.get('window').width * .4,
        backgroundColor: Color.LIGHT_BORDER,
        borderRadius: 1000,
        height: 4,    
    },
    textContainer: {
        marginTop: Dimensions.get('window').height * .06,
        marginHorizontal: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .03,
    },
    headerText: {
        marginBottom: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandBold',
        fontSize: Dimensions.get('window').height * .025,
        color: Color.WHITE,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2
    },
    backView: {
        position: 'absolute',
        top: Dimensions.get('window').height * .055,
        left: Dimensions.get('window').height * .015,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .035,
        color: Color.WHITE,
    },
    sv: {
        marginTop: Dimensions.get('window').height * .02,
        height: Dimensions.get('window').height
    },
    toggleContainer: {
        flexDirection: 'row',
        paddingVertical: Dimensions.get('window').height * .02,
        borderBottomWidth: 1,
        borderColor: Color.LIGHT_BORDER,
        marginHorizontal: Dimensions.get('window').width * .05,
    },
    item: {
        flex: 1,
        fontSize: Dimensions.get('window').height * .014,
        fontFamily: 'QuicksandMedium'
    },
    switchView: {
        flex: 1,
        alignItems: "flex-end",
    },
    carrot: {
        fontSize: Dimensions.get('window').height * .02,
        color: 'rgba(0,0,0,.3)'
    },
    category: {
        fontFamily: 'QuicksandSemiBold',
        paddingHorizontal: Dimensions.get('window').height * .02,
        marginBottom: Dimensions.get('window').height * .03,
        fontSize: Dimensions.get('window').height * .02,
    },
    socialIcon: {
        width: 60,
        height: 60,
    },
    socialIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        marginTop: Dimensions.get('window').height * .03
    }
})

export default HelpScreen
