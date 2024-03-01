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
        connectionModalVisible: false,
        accountDeletedModalVisible: false,
        doneWithPosts: false,
        loggingOut: false
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

  // Check for updates
  // checkForUpdates = () => {
  
  //   // DEV ONLY - Update the version number
  //   const appInfo = {
  //     appId: Platform.OS == 'ios' ? APP_STORE_ID : GOOGLE_STORE_ID, // Your app url in play store or app store
  //     appName: 'Pebble', // Your app name
  //     appVersion: '1.1.7', // Your app version
  //     platform: Platform.OS == 'ios' ? 'ios' : 'android', // App Platform, android or ios
  //     environment: 'production', // App Environment, production, development
  //   };
  
  //   // Alert config is optional
  //   const alertConfig = {
  //     title: 'Update Available',
  //     updateButtonTitle: 'Update',
  //     laterButtonTitle: 'Later',
  //     onDismissCallback: () => { console.log('Dismiss') },
  //     onLaterCallback: () => { console.log('Later') }
  //   };
  
  //   appUpgradeVersionCheck(appInfo, updateApiKey, alertConfig);
  // }

  // Tests connection when component loads, also always keeps the user up to date
  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      // this.checkForUpdates()
      await this.loadEverything()
      // Gets the setup modal to start
    })
  } 

  // Unsubscribes before the component closes TODO
  componentWillUnmount() {
    // this.unsubscribe()
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

  // Gets all of the posts that the user should see on their feed
  getAllPosts = async (isRefreshing) => {

    // Send get request to server for all posts
    if (Object.keys(this.state.user).length === 0 || this.state.token === "") { return }
    const authStr = 'Bearer '.concat(this.state.token); 
    try {
      let config = {
        headers: {Authorization: authStr},
        params: {
            postPage: isRefreshing ? 0 : this.state.postPage
        },
      }
      const response = await api.get('/getPosts', config)
      if (!response.data || !response.data.listOfPosts || response.data.listOfPosts.length < 1 || Object.keys(response.data.usersInPosts).length < 1 || Object.keys(response.data.penguinsInPosts).length < 1) {
        console.log("No more posts to load")
        this.setState({doneWithPosts: true, loadingMorePosts: false})
        if (isRefreshing) {
          this.setState({posts: []})
        }
      }
      else {
        console.log("Successfully got posts from server")
        if (!isRefreshing) {
          let newPosts = []
          for (let i = 0; i < response.data.listOfPosts.length; ++i) {
            if (!this.state.postIds.has(response.data.listOfPosts[i]._id.toString())) {
              newPosts.push(response.data.listOfPosts[i])
            }
          }
          this.setState({
            posts: this.state.posts.concat(newPosts),
            postIds: new Set([...this.state.postIds, ...response.data.postIds]),
            connectionModalVisible: false,
            postPage: this.state.postPage + 1,
            loadingMorePosts: false
          })
        }
        else {
          this.setState({
            posts: response.data.listOfPosts,
            postIds: new Set(response.data.postIds),
            connectionModalVisible: false,
            postPage: this.state.postPage + 1,
            loadingMorePosts: false
          })
        }
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

    // Gets all the posts for the feed
    await this.getAllPosts(true)

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

  // When the end of the list is reached
  endReached = async () => {
    console.log("END HAS BEEN REACHED")
    if (this.state.doneWithPosts || this.state.loading || this.state.posts.length < 1) {
      return
    }
    if (!this.state.loadingMorePosts && this.state.timerPosts) {
      console.log("INSIDE LOADING MORE")
      this.setState({loadingMorePosts: true})
      await this.getAllPosts(false)
    }
  }

  // Shows when the list has no posts
  renderEmptyList = () => {
    // headerText, subHeaderText, hasButton, buttonFunc, buttonText
    return <View style={{marginHorizontal: Dimensions.get('window').width * .05, marginTop: -Dimensions.get('window').height * .02}}>
              <EmptyContainerComponent headerText={"There Are No Posts for You to See!"} hasButton={true} subHeaderText={null}
                                    buttonFunc={null} buttonText={null} />
            </View>
  }

  // Renders the activity indicator for lazy loading
  renderLoader = () => {
    return <View style={{marginTop: Dimensions.get('window').height * .02, alignItems: 'center', marginBottom: Dimensions.get('window').height * .4,}}>
              {
                this.state.loadingMorePosts
                  ? <ActivityIndicator
                    animating={true}
                    size="small"
                    color={Color.MAIN}
                />
                : null
              }
            </View>
  }

  // Renders the Home list
  renderHomeScreen = () => {
    return <View>
      {
        this.state.loadingData
        ? <LoadingIndicator isBottomScreen={true} loadingData={true} />
        : <FlatList 
            showsVerticalScrollIndicator={false}
            refreshControl={
            <RefreshControl
              tintColor={Color.MAIN}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}
            style={styles.list}
            data={this.state.posts}
            keyExtractor={post => post._id}
            ListEmptyComponent={this.renderEmptyList}
            ListFooterComponent={this.renderLoader}
            onEndReached={this.endReached}
            onEndReachedThreshold={0}
            renderItem={({item, index}) => (
              index !== this.state.posts.length - 1
              ? <PostComponent setErrorModal={this.setConnectionModalVisible} penguin={this.getPenguin(item.userId)} user={this.getUser(item.userId)} localUser={this.state.user} token={this.state.token} navigation={this.props.navigation} post={item} index={index}/>
              : <View style={styles.postContainer}>
                  <PostComponent setErrorModal={this.setConnectionModalVisible} penguin={this.getPenguin(item.userId)} user={this.getUser(item.userId)} localUser={this.state.user} token={this.state.token} navigation={this.props.navigation} post={item} index={index}/>
                </View>
            )}
            />
      }
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
              
              {
                // Provides better caching for the user's profile picture
                this.state.loading || !this.state.user || Object.keys(this.state.user).length == 0
                ? null
                : <BetterImage cacheKey={this.state.user.photos[0].split('/')[1].split(".")[0]} resizeMode="contain" style={{opacity: 0, width: 1, height: 1, position: 'absolute', top: 0}} source={{uri: serverName + this.state.user.photos[0]}} />
              }
              <NoConnectionModal modalVisible={this.state.connectionModalVisible} setModalVisible={this.setConnectionModalVisible} testConnection={this.testConnection} />
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
                          : <>{this.renderHomeScreen()}</>
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
    bottom: Dimensions.get('window').height * .36,
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