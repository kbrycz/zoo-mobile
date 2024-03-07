import * as React from 'react';
import { Text, RefreshControl, SafeAreaView, FlatList, StyleSheet, 
         TouchableOpacity, Dimensions, View, InteractionManager, Platform, StatusBar, ActivityIndicator } from 'react-native';
import api from '../../api/server'
import { Ionicons, Entypo, AntDesign, Feather  } from '@expo/vector-icons'; 
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
import ProfileImageComponent from '../../components/profile/ProfileImageComponent';
import ProfileHeadComponent from '../../components/profile/ProfileHeadComponent';
import ProfileButtonsComponent from '../../components/profile/ProfileButtonsComponent';


// Home screen for all posts
class ProfileScreen extends React.Component {

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


  // Runs when component loads
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.loadEverything()
    })
    this.unsubscribe = Store.subscribe(() => this.setState({user: Store.getState().user}))
  } 

    // Remove the focus listener before closing
    componentWillUnmount() {
      this.unsubscribe();
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
      let tempUser = await getlocalUserData(this.state.token)
      if (!tempUser) {
          throw "User does not need to be updated"
      }
      this.setState({
        user: tempUser,
        connectionModalVisible: false
      })
      console.log("Successfully got user from server")
      return true
    }
    catch (err) {
      console.log(err)
      this.setConnectionModalVisible(true)
      return false
    }
  }

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
    if (this.state.loading || !this.state.user || Object.keys(this.state.user).length < 1) {
      return (
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
        <NoConnectionModal modalVisible={this.state.connectionModalVisible} setModalVisible={this.setConnectionModalVisible} testConnection={this.testConnection} />
          <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
              <View style={styles.textContainer}>
                {
                  this.state.loading || !this.state.user || Object.keys(this.state.user).length == 0
                  ? <Text style={styles.headerTextFake}></Text>
                  : <Text style={styles.headerText}>Profile</Text>
                }
              </View>
              <View style={styles.whiteContainer}>
                <View style={styles.line} />
                <View style={styles.mainContainer}>
                </View>
              </View>
          </SafeAreaView>
      </LinearGradient>
      )
    }
    return (
    <View style={styles.bg}>
        <NoConnectionModal modalVisible={this.state.connectionModalVisible} setModalVisible={this.setConnectionModalVisible} testConnection={this.testConnection} />
        <TouchableOpacity style={styles.trophyContainer}>
              <View style={styles.trophyAmountContainer}>
                  <Ionicons name="trophy" style={[styles.trophies, styles.gold]} />
                  <Text style={styles.score}>{this.state.user.gold}</Text>
              </View>
              <View style={styles.trophyAmountContainer}>
                  <Ionicons name="trophy" style={[styles.trophies, styles.silver]} />
                  <Text style={styles.score}>{this.state.user.silver}</Text>
              </View>
              <View style={[styles.trophyAmountContainer, {borderRightWidth: 0,}]}>
                  <Ionicons name="trophy" style={[styles.trophies, styles.bronze]} />
                  <Text style={styles.score}>{this.state.user.bronze}</Text>
              </View>
          </TouchableOpacity>
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
          <ProfileImageComponent clickFunction={this.viewProfile} 
                                image={null} />
          <ProfileHeadComponent user={this.state.user} token={this.state.token} navigation={this.props.navigation} />
          <TouchableOpacity style={styles.editButton} onPress={() => this.props.navigation.navigate('EditProfile', {user: this.state.user, token: this.state.token})}>
            <Feather name="edit" style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => this.props.navigation.navigate('ContactsAdd')}>
            <Ionicons name="person-add-outline" style={styles.addIcon} />
          </TouchableOpacity>
        </LinearGradient>
        <SafeAreaView>
          <ProfileButtonsComponent user={this.state.user} navigation={this.props.navigation} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: Color.BACKGROUND,
    height: Dimensions.get('window').height,
  },
  grad: {
    marginTop: -Dimensions.get('window').height *.02,
    height: Dimensions.get('window').height *.47,
    borderRadius: 30
  },
  trophyContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height * .4,
    paddingVertical: Dimensions.get('window').height * .035,
    paddingHorizontal: Dimensions.get('window').width * .05,
    flexDirection: "row",
    width: Dimensions.get('window').width * .8,
    marginHorizontal: Dimensions.get('window').width * .1,
    backgroundColor: Color.WHITE,
    shadowColor: Color.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10, 
    borderRadius: 5,
    zIndex: 10,

  },
  trophyAmountContainer: {
      flexDirection: "row",
      flex: 1,
      borderRightWidth: 1,
      borderColor: 'rgba(0,0,0,.1)',
      justifyContent: 'center'
  },
  trophies: {
      fontSize: Dimensions.get('window').height * .025,
  },
  bronze: {
      color: "#6A3805"
  },
  silver: {
      color: "#B4B4B4"
  },
  gold: {
      color: "#C9B037"
  },
  score: {
      marginLeft: Dimensions.get('window').width * .02,
      fontSize: Dimensions.get('window').height * .02,
      fontFamily: 'QuicksandBold',
      color: Color.DARK,
      textAlign: 'center'
  },
  editButton: {
    position: 'absolute',
    top: Dimensions.get('window').height * .17,
    left: Dimensions.get('window').width * .1,
    borderRadius: Dimensions.get('window').height * .2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  editIcon: {
    fontSize: Dimensions.get('window').height * .025,
    padding: Dimensions.get('window').height * .014,
    color: Color.WHITE,
  },
  addButton: {
    position: 'absolute',
    top: Dimensions.get('window').height * .17,
    right: Dimensions.get('window').width * .1,
    borderRadius: Dimensions.get('window').height * .2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  addIcon: {
    fontSize: Dimensions.get('window').height * .025,
    padding: Dimensions.get('window').height * .014,
    color: Color.WHITE,
  }
})

export default ProfileScreen