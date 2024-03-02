import * as React from 'react';
import { Text, RefreshControl, SafeAreaView, FlatList, StyleSheet, 
         TouchableOpacity, Dimensions, View, InteractionManager, Platform, StatusBar, ActivityIndicator } from 'react-native';
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
            <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
              <NoConnectionModal modalVisible={this.state.connectionModalVisible} setModalVisible={this.setConnectionModalVisible} testConnection={this.testConnection} />
                <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                    <View style={styles.textContainer}>
                      {
                        this.state.loading || !this.state.user || Object.keys(this.state.user).length == 0
                        ? <Text style={styles.headerTextFake}></Text>
                        : <Text style={styles.headerText}>Map</Text>
                      }
                    </View>
                    <View style={styles.whiteContainer}>
                      <View style={styles.line} />
                      <View style={styles.mainContainer}>
                      </View>
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
  headerTextFake: {
    marginTop: Dimensions.get('window').height * .05,
    fontSize: Dimensions.get('window').height * .025,
    color: Color.WHITE,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 2
  },
})

export default MapScreen