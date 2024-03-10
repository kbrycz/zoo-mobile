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
import ChatModalComponent from '../../components/home/ChatModalComponent';


// Home screen for all posts
class HomeScreen extends React.Component {

  // Initialize the Home screen state
  constructor() {
    super()
    this.state = {
        refreshing: false,
        loading: true,
        loadingData: false,
        posts: [],
        token: null,
        user: {},
        postIds: new Set(),
        loadingMorePosts: true,
        postPage: 0,
        modalVisible: false,
        connectionModalVisible: false,
        accountDeletedModalVisible: false,
        doneWithPosts: false,
        loggingOut: false,
        timerPosts: false
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
  // Tests connection when component loads, also always keeps the user up to date
  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      await this.loadEverything()
    })
    this.unsubscribe = Store.subscribe(() => {
      if (!this.state.loggingOut) {
        this.setState({user: Store.getState().user})
      }
    })
  } 

    // Sets the modal visible
    setModalVisible = (isVis) => {
      this.setState({modalVisible: isVis})
    }
  

  // Unsubscribes before the component closes TODO
  componentWillUnmount() {
    this.unsubscribe()
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

  // Load all of the asyncs before loading page
  loadEverything = async () => {
    console.log("loading everything")

    // Loads all the fonts
    await Font.loadAsync({
      'QuicksandMedium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
      'QuicksandSemiBold': require('../../../assets/fonts/Quicksand-SemiBold.ttf'),
      'QuicksandBold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    });

    // Get the user obj and token from correct place
    await this.getUserInfo()

    // Get all posts
    this.getPosts()

    // Delays the refreshing of posts since the splash screen shows up first
    setTimeout(() => {
      this.setState({timerPosts: true})
    }, 3000);

    this.setState({loading: false})
  }

  // Updates all of the necessary data from the server when user trys to refresh
  onRefresh = () => {
    this.setState({refreshing: true, doneWithPosts: false, postPage: 0, timerPosts: false}, () => {

      this.loadEverything()

      // setting timeout for more natural look on refresh
      setTimeout(() => {
        this.setState({
          refreshing: false,
          timerPosts: true
        })
      }, 1000)
    })
  }

  // Logs the user out of the app
  logOut = async () => {
    this.setState({accountDeletedModalVisible: false, loggingOut: true}, async () => {
      await AsyncStorage.removeItem('token')
      
      this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Auth'}],
      });
    })
  }

  getPosts = () => {
    let posts = [
      {
        id: 1,
        title: "Brycz Zoo 5k for Turtles",
        description: "Join us for our annual turtle race to help bring awareness to poor turtle treatment",
        date: new Date() - 2,
        image: "../../../assets/main/event.jpeg"
      },
      {
        id: 2,
        title: "Night Lights Coming Soon!",
        description: "Come enjoy a night show unlike any other! A perfect date spot!",
        date: new Date() - 3,
        image: "../../../assets/main/event.jpeg"
      },
      {
        id: 3,
        title: "Getting Married?",
        description: "Come check out what we have to offer in terms of wedding venues!",
        date: new Date() - 3,
        image: "../../../assets/main/event.jpeg"
      },
      {
        id: 4,
        title: "Need Daycare?",
        description: "Take your kids away from their screens and say hello to growing up learning about animals!",
        date: new Date() - 3,
        image: "../../../assets/main/event.jpeg"
      }
    ]

    this.setState({
      posts: posts
    })
  }

    // Renders the activity indicator for lazy loading
    renderLoader = () => {
      return <View style={{marginTop: Dimensions.get('window').height * .02, alignItems: 'center', marginBottom: Dimensions.get('window').height * .2,}}>
              </View>
    }


  // Renders the jsx for the UI
  render() {
    return (
            <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
              {
                this.state.loading
                ? null
                : <DeletedAccountModal modalVisible={this.state.accountDeletedModalVisible} setModalVisible={this.setAccountDeletedModalVisible} logOut={this.logOut} />
              }
            
              <NoConnectionModal modalVisible={this.state.connectionModalVisible} setModalVisible={this.setConnectionModalVisible} testConnection={this.testConnection} />
              <ChatModalComponent modalVisible={this.state.modalVisible} setModalVisible={this.setModalVisible} user={this.state.user} />
                <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                    <View style={styles.textContainer}>
                      {
                        this.state.loading || !this.state.user || Object.keys(this.state.user).length == 0
                        ? <Text style={styles.headerTextFake}></Text>
                        : <Text style={styles.headerText}>Home</Text>
                      }
                    </View>
                    <View style={styles.whiteContainer}>
                      <View style={styles.line} />
                      <View style={styles.mainContainer}>
                      {
                        this.state.loading || !this.state.user || Object.keys(this.state.user).length == 0
                        ? <LoadingIndicator isBottomScreen={true} loadingData={this.state.loading} />
                        : <>
                            <FlatList
                              showsVerticalScrollIndicator={false}
                              ListFooterComponent={this.renderLoader}
                              refreshControl={
                                  <RefreshControl
                                      tintColor={Color.MAIN}
                                      refreshing={this.state.refreshing}
                                      onRefresh={this.onRefresh}
                                  />
                              }
                              style={styles.list}
                              data={this.state.posts}
                              keyExtractor={post => post.id.toString()} // Make sure your posts have a unique id
                              renderItem={({ item, index }) => (
                                  <PostComponent
                                      post={item}
                                  />
                              )}
                          />
                          <TouchableOpacity style={styles.iconContainer} onPress={() => this.setModalVisible(true)}>
                            <LinearGradient style={{borderRadius: Dimensions.get('window').height * .04}} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                              <Ionicons name="bulb-outline" style={styles.viewDetailsIcon} />
                            </LinearGradient>  
                          </TouchableOpacity>
                        </>
                      }

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
  list: {
    height: Dimensions.get('window').height,
  },
  line: {
    marginTop: Dimensions.get('window').height * .03,
    width: Dimensions.get('window').width * .2,
    marginHorizontal: Dimensions.get('window').width * .4,
    backgroundColor: Color.LIGHT_BORDER,
    borderRadius: 1000,
    height: 4,
  },
  iconContainer: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * .15,
    right: Dimensions.get('window').width * .05,
    opacity: .8
  },
  viewDetailsIcon: {
    fontSize: Dimensions.get('window').height * .035,
    color: Color.WHITE,
    padding: Dimensions.get('window').height * .023,
    paddingHorizontal: Dimensions.get('window').height * .023,
    borderRadius: Dimensions.get('window').height * .03,
    overflow: 'hidden'
  },
  writePostIcon: {
    fontSize: Dimensions.get('window').height * .04,
    color: Color.WHITE,
    padding: Dimensions.get('window').height * .02,
    paddingHorizontal: Dimensions.get('window').height * .02,
    borderRadius: Dimensions.get('window').height * .03,
    overflow: 'hidden'
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
  addButton: {
    position: 'absolute',
    top: Dimensions.get('window').height * .035,
    right: 0,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  helpButton: {
    position: 'absolute',
    top: Dimensions.get('window').height * .035,
    left: 0,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  addIcon: {
    fontSize: Dimensions.get('window').height * .025,
    padding: Dimensions.get('window').height * .014,
    color: Color.WHITE,
  },
})

export default HomeScreen