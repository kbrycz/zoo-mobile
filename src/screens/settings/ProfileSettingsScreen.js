import * as React from 'react';
import { StyleSheet, Dimensions, Text, TouchableOpacity,
         SafeAreaView, Linking, View, ScrollView, Platform, StatusBar, Switch, ActivityIndicator} from 'react-native';
import api from '../../api/server'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import { Store } from '../../redux/store';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Color from '../../../global/colors'
import NoConnectionModal from '../../components/modal/NoConnectionModal';
import MoveForwardModalComponent from "../../components/modal//MoveForwardModalComponent";
import { setUser } from '../../redux/actions';
import HelpModalComponent from '../../components/modal/HelpModalComponent';

// Account pop up screen for all user account info
class ProfileSettingsScreen extends React.Component {
    
  // Initialize the Account Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
      loadingData: false,
      user: {},
      token: null,
      connectionModalVisible: false,
      modalExitVisible: false,
      helpModalVisible: false,
      helpText: '',
      subText: '',
      modalError: false,
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

  // Sets the modal visible
  setConnectionModalVisible = (isVis) => {
    this.setState({connectionModalVisible: isVis})
  }

   // Sets the modal visible
  setModalExitVisible = (isVis) => {
    this.setState({modalExitVisible: isVis, modalError: false})
  } 

  // Sets the help modal visible
  setHelpModalVisible = (isVis) => {
    this.setState({helpModalVisible: isVis})
}

  // Load everything when component loads
  componentDidMount() {
    this.loadEverything()
  } 

  // Load everything for the account screen
  loadEverything = async () => {
    try {
        let tokenTemp = await AsyncStorage.getItem('token')
        let user = Store.getState().user
        this.setState({
          token: tokenTemp,
          user: user,
          loading: false,
        })
    }
    catch (err) {
        console.log(err)
        this.setState({loading: false})
        this.setConnectionModalVisible(true)
    }
  }

  // Sends the user to the update account screen according to specific data
  // info: 0 = name, 1 = number, 2 = email, 3 = password
  updateAccountInfo = (typeOfChange) => {
    let obj = {
        typeOfChange: typeOfChange,
        token: this.state.token
    }
    this.props.navigation.navigate('UpdateAccount', obj)
  }

  // Renders the jsx for the UI
  render() {
    if (this.state.loading) {
      return <LoadingIndicator loadingData={this.state.loading} />
    }
    return (
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
            <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                <NoConnectionModal modalVisible={this.state.connectionModalVisible} setModalVisible={this.setConnectionModalVisible} testConnection={this.testConnection} />
                <MoveForwardModalComponent modalError={this.state.modalError} loadingData={this.state.loadingData} modalExitVisible={this.state.modalExitVisible} setModalExitVisible={this.setModalExitVisible} buttonFunc={this.deleteAccount} 
                                           buttonText={"Delete"} header={"Are You Sure You Want to Delete Your Account?"} sub={"This change is irreversible and will remove all of your data! If you ever want to come back, you can always create a new account and start fresh!"} />
                <HelpModalComponent modalVisible={this.state.helpModalVisible} setModalVisible={this.setHelpModalVisible} text={this.state.helpText} sub={this.state.subText} />
                <View style={styles.backView}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} disabled={this.state.loadingData}>
                        <Ionicons name="close-outline" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.headerText}>Profile Settings</Text>
                </View>
                <View style={styles.whiteContainer}>
                    <View style={styles.line} />
                    <ScrollView style={styles.sv}>
                        <View style={styles.mainContainer}>
                            <View style={styles.whiteBackground}>
                                <Text style={styles.category}>Profile</Text>
                                <TouchableOpacity style={[styles.toggleContainer, {borderTopWidth: 1}]}
                                    onPress={() => this.updateAccountInfo(0)}>
                                    <Text style={styles.item}>Name</Text>
                                    <View style={styles.switchView}>
                                        <Ionicons name="chevron-forward-outline" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toggleContainer}
                                    onPress={() => this.updateAccountInfo(1)}>
                                    <Text style={styles.item}>Profile Picture</Text>
                                    <View style={styles.switchView}>
                                        <Ionicons name="chevron-forward-outline" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.whiteBackground}>
                                <Text style={styles.category}>Personal Information</Text>
                                <TouchableOpacity style={[styles.toggleContainer, {borderTopWidth: 1}]}
                                    onPress={() => this.updateAccountInfo(2)}>
                                    <Text style={styles.item}>Birthdate</Text>
                                    <View style={styles.switchView}>
                                        <Ionicons name="chevron-forward-outline" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toggleContainer}
                                    onPress={() => this.updateAccountInfo(3)}>
                                    <Text style={styles.item}>Gender</Text>
                                    <View style={styles.switchView}>
                                        <Ionicons name="chevron-forward-outline" style={styles.carrot} />
                                    </View>
                                </TouchableOpacity>
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
        marginBottom: Dimensions.get('window').height * .15,
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
    header: {
        width: Dimensions.get('window').width * .9,
        marginLeft: Dimensions.get('window').width * .05,
        marginRight: Dimensions.get('window').width * .05,
        textAlign: 'center',
        textTransform: 'capitalize',
        fontSize: Dimensions.get('window').height * .035,
        fontFamily: 'QuicksandMedium',
        marginBottom: Dimensions.get('window').height * .02,
    },
    toggleContainer: {
        flexDirection: 'row',
        paddingVertical: Dimensions.get('window').height * .02,
        borderBottomWidth: 1,
        borderColor: Color.LIGHT_BORDER,
        marginHorizontal: Dimensions.get('window').width * .05,
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
    deleteButton: {
        marginBottom: Dimensions.get('window').height * .08,
        marginHorizontal: Dimensions.get('window').width * .1,
        width: Dimensions.get('window').width * .8,
        borderRadius: 5,
        padding: Dimensions.get('window').height * .02,
        borderColor: Color.MAIN,
        borderWidth: 1
    },
    deleteText: {
        fontSize: Dimensions.get('window').height * .015,
        textAlign: 'center',
        fontFamily: "QuicksandBold",
        color: Color.MAIN
    },
    logOutButton: {
        marginTop: Dimensions.get('window').height * .05,
        marginBottom: Dimensions.get('window').height * .02,
        marginHorizontal: Dimensions.get('window').width * .1,
        width: Dimensions.get('window').width * .8,
        borderRadius: 5,
        padding: Dimensions.get('window').height * .02,
    },
    logOutText: {
        fontSize: Dimensions.get('window').height * .015,
        textAlign: 'center',
        fontFamily: "QuicksandBold",
        color: Color.WHITE,
    },
    helpIcon: {
        fontSize: Dimensions.get('window').height * .017,
        opacity: .5,
        paddingTop: Dimensions.get('window').height * .017,
        paddingLeft: Dimensions.get('window').width * .01,
    },
    helpButton: {
        flex: 1,
        height: Dimensions.get('window').height * .034,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
    },
    item: {
        flex: 1,
        fontSize: Dimensions.get('window').height * .014,
        fontFamily: 'QuicksandMedium',
        lineHeight: Dimensions.get('window').height * .026,
    },
})

export default ProfileSettingsScreen