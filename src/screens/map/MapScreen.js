import * as React from 'react';
import { Text, RefreshControl, SafeAreaView, FlatList, StyleSheet, 
         Image, Dimensions, View, InteractionManager, Platform, StatusBar, Linking, TouchableOpacity, ScrollView } from 'react-native';
import api from '../../api/server'
import { Ionicons, Entypo, AntDesign  } from '@expo/vector-icons'; 
import * as Color from '../../../global/colors'
import * as Font from 'expo-font';
import { getlocalUserData } from '../../functions/GetUserData'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import _ from 'lodash'
import PostComponent from '../../components/home/PostComponent';
import NoConnectionModal from '../../components/modal/NoConnectionModal';
import { LinearGradient } from 'expo-linear-gradient';
import EmptyContainerComponent from '../../components/general/EmptyContainerComponent';
import DeletedAccountModal from '../../components/modal/DeletedAccountModal';
import { serverName } from '../../api/serverName';
import BetterImage from '../../components/general/BetterImage';
import { Store } from '../../redux/store';
import ImageZoom from 'react-native-image-pan-zoom';
import ViewImageModal from '../../components/modal/ViewImageModal';



// Home screen for all posts
class MapScreen extends React.Component {

  // Initialize the Home screen state
  constructor() {
    super()
    this.state = {
        refreshing: false,
        loading: true,
        loadingData: false,
        token: null,
        user: {},
        connectionModalVisible: false,
        viewModalVisible: false
    }
  } 

  // Pings the server to see if it can connect and then calls the setup function
  testConnection = async () => {
    try {
      await api.get('/testConnection')
      return true
    }
    catch {
      console.log("Not connected to internet")
      this.setConnectionModalVisible(true)
      return false
    }
  }


  // Tests connection when component loads, also always keeps the user up to date
  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      // this.checkForUpdates()
      await this.loadEverything()
      // Gets the setup modal to start
    })
  } 

  // Sets the loading variable
  setLoadingData = (isLoading) => {
    this.setState({loadingData: isLoading})
  }


  // Sets the connection modal visible
  setConnectionModalVisible = (isVis) => {
    this.setState({connectionModalVisible: isVis})
  }

  // Sets the connection modal visible
  setViewModalVisible = (isVis) => {
    this.setState({viewModalVisible: isVis})
  }

  openDirectionsMap = () => {
    const address = encodeURIComponent('50 Belmont St Chicago IL');
    const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const url = Platform.OS === 'ios' ? `maps:0,0?q=${address}` : `geo:0,0?q=${address}`;
  
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }
  
  openZooMap = () => {

  }

  // Gets the current user and adds the obj to the store
  getUserInfo = async () => {
    try {
      let tokenTemp = await AsyncStorage.getItem('token')

      let tempUser = await getlocalUserData(tokenTemp)
      if (!tempUser) { 
        console.log("Unable to get the user from the server or storage")
        this.setState({user: {}, token: tokenTemp, connectionModalVisible: false, accountDeletedModalVisible: true})
        return
      }
      else {
        console.log("Successfully got user from server")
        this.setState({
          user: tempUser, 
          token: tokenTemp, 
          connectionModalVisible: false
        })
      }
    }
    catch (err) {
      console.log(err)
      this.setConnectionModalVisible(true)
    }
  }

  // Load everything before loading screen
  loadEverything = async () => {
    console.log("loading everything for profile")
    let tokenTemp = await AsyncStorage.getItem('token')
    let user = Store.getState().user
    this.setState({
      user: user,
      token: tokenTemp,
      loading: false
    })
}


  // Renders the jsx for the UI
  render() {

    return (
      <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5, Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
        <ViewImageModal viewModalVisible={this.state.viewModalVisible} setViewModalVisible={this.setViewModalVisible} image={require('../../../assets/main/zoo.png')} isInRepo={true}/>
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Maps</Text>
          </View>
          <View style={styles.whiteContainer}>
          <View style={styles.line} />
            <View style={styles.mainContainer}>
              <ScrollView>
                <View style={styles.whiteBackground}>
                  <Text style={styles.subTitle}>Feeling lost?</Text>
                  <Text style={styles.sub}>Need help navigating to or around the zoo? Use the buttons below to help make your experience as stress free as possible!</Text>
                  <View style={styles.imageContainer}>
                        <BetterImage
                        style={styles.image} 
                        source={require('../../../assets/main/happy.jpg')}
                        />
                    </View>
                  <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                      <TouchableOpacity onPress={() => this.setViewModalVisible(true)}>
                          <Text style={styles.buttonText}>Brycz Zoo Map</Text>
                      </TouchableOpacity>
                  </LinearGradient>
                  <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                      <TouchableOpacity onPress={this.openDirectionsMap}>
                          <Text style={styles.buttonText}>Directions</Text>
                      </TouchableOpacity>
                  </LinearGradient>
                </View>
              </ScrollView>
            </View>
          </View>
          
        </SafeAreaView>
      </LinearGradient>
    );
  }
}


const styles = StyleSheet.create({
  grad: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  textContainer: {
    height: Dimensions.get('window').height * .1,
    marginHorizontal: Dimensions.get('window').width * .075,
    marginBottom: Dimensions.get('window').height * .02,
  },
  headerText: {
    marginTop: Dimensions.get('window').height * .05,
    fontFamily: 'QuicksandBold',
    fontSize: Dimensions.get('window').height * .025,
    color: Color.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2
  },
  whiteContainer: {
    backgroundColor: Color.BACKGROUND,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
  },
  whiteBackground: {
    marginTop: Dimensions.get('window').height * .01,
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
    marginBottom: Dimensions.get('window').height * .03,

},

  mainContainer: {
    marginTop: Dimensions.get('window').height * .03,
    height: Dimensions.get('window').height * .8,
  },
  line: {
    marginTop: Dimensions.get('window').height * .03,
    width: Dimensions.get('window').width * .2,
    marginHorizontal: Dimensions.get('window').width * .4,
    backgroundColor: Color.LIGHT_BORDER,
    borderRadius: 1000,
    height: 4,
  },
sub: {
  marginHorizontal: Dimensions.get('window').width * .05,
  fontFamily: 'QuicksandMedium',
  fontSize: Dimensions.get('window').height * .015,
  color: Color.HEADER,
  textAlign: "center",
  opacity: 0.7,
  marginBottom: Dimensions.get('window').height * .01,
  lineHeight: Dimensions.get('window').height * .025,
},
subTitle: {
  fontFamily: "QuicksandSemiBold",
  fontSize: Dimensions.get('window').height * .02, 
  marginBottom: Dimensions.get('window').height * .005, 
  color: Color.HEADER,
  marginBottom: Dimensions.get('window').height * .02, 
  textAlign: "center"
},
button: {
  marginTop: Dimensions.get('window').height * .02,
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
imageContainer: {
  marginTop: Dimensions.get('window').height * .02,
  width: Dimensions.get('window').width * .85,
  height: Dimensions.get('window').width * .5,
  marginBottom: Dimensions.get('window').height * .01,
},
image: {
  width: '100%',
  height: '100%',
  resizeMode:'contain',
  borderRadius: 10
},
});
export default MapScreen