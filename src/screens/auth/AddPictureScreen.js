import * as React from 'react';
import { View, Dimensions, StyleSheet, 
        Text, SafeAreaView, ActionSheetIOS, Platform, StatusBar} from 'react-native';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import * as Color from '../../../global/colors'
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker'
import uuid from 'react-native-uuid';
import ViewImageModal from '../../components/modal/ViewImageModal';
import BetterImage from '../../components/general/BetterImage';
import AndroidActionModal from '../../components/modal/AndroidActionModal';


// Screen to add the picture in auth
class AddPictureScreen extends React.Component {

  // Initialize the Add Picture Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
      loadingData: false,
      profilePicture: null,
      currentImageView: '',
      viewModalVisible: false,
      activePhoto: -1,
      androidActionModal: false,
      androidActionIndex: 0,
      modalVisible: false,
      errorMessage: ""
    }
  } 

  // Loads everything when the component loads
  componentDidMount() {
    this.loadEverything()
  }

  // Loads all of the asyncs before showing page
  loadEverything = async () => {
    this.setState({
        loading: false,
    })
  }

  // Set the view modal visible
  setViewModalVisible = (isVis) => {
      this.setState({
          viewModalVisible: isVis
      })
  }

  // Sets the android action modal visible
  setAndroidActionModal = (isVis) => {
      this.setState({androidActionModal: isVis})
  }

  // Sets the skip modal visible
  setModalVisible = (isVis) => {
    this.setState({modalVisible: isVis})
  }

  // Add photo to users profile
  addPhoto = async () => {
    try {
        this.setState({loadingData: true, errorMessage: ""})

        // Try to get permission for the app to use the users media
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        
        // If the user doesn't let you have access, need error message
        if (status !== 'granted') {
            console.log("Permission denied")
            this.setState({errorMessage: "We need permission to access your photos!", loadingData: false})
            return
        }
  
        // Launches the media library for the user to pick a photo
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true, 
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,4],
            quality: .3
        })


  
        // Begin the post request process if cancel button isn't clicked
        if (!result.canceled) {

            result = result.assets[0]
            let isGifArray = result.uri.split('.')
            if (isGifArray.length > 1) {
              if (isGifArray[isGifArray.length - 1] == 'gif') {
                this.setState({errorMessage: "We do not support gifs!"})
                return
              }
            }

          // Collect the body params for the post request
          let data = {
            imageName: uuid.v4().toString() + '.png',
            image: result.base64,
            uri: result.uri
          }
          
          this.setState({
            profilePicture: data,
            loadingData: false
          })
        }
        else {
            this.setState({loadingData: false})
        } 
      }
      catch (err) {
          console.log(err.message)
          this.setState({
            loading: false,
            loadingData: false,
            connectionModalVisible: true
          })
      }
  }

  // View photo of picture
  viewPhoto = async () => {
    this.setState({
        currentImageView: this.state.profilePicture.uri,
        viewModalVisible: true
    })
  }

  // Delete photo from user profile
  deletePhoto = async () => {
      this.setState({loadingData: true})
      this.setState({
        profilePicture: null
      }, () => {
          this.setState({loadingData: false})
      })
  }

  // When user clicks one of their profile images, reacts accordingly
  photoActionButton = () => {
    if (Platform.OS == 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel", "View", "Delete"],
              destructiveButtonIndex: 2,
              cancelButtonIndex: 0,
              userInterfaceStyle: 'dark'
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                this.viewPhoto()
              } else if (buttonIndex === 2) {
                console.log("Delete image")
                this.deletePhoto()
              }
            }
        )
    }
    else {
        this.setState({
            androidActionIndex: 0,
            androidActionModal: true
        })
    }
  }

  // Send the user on to the next screen
  nextPage = () => {
    let userObj = {
      first: this.props.route.params.first,
      last: this.props.route.params.last,
      birthdate: this.props.route.params.birthdate,
      number: this.props.route.params.number,
      gender: this.props.route.params.gender,
      profilePicture: this.state.profilePicture,
    }
    this.props.navigation.navigate('FinalPageScreen', userObj)
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
            <AndroidActionModal modalVisible={this.state.androidActionModal} setModalVisible={this.setAndroidActionModal} androidActionProcess={1} 
                                    androidActionIndex={this.state.androidActionIndex} deletePhoto={this.deletePhoto} viewPhoto={this.viewPhoto} deletePrompt={null} />
            <ViewImageModal viewModalVisible={this.state.viewModalVisible} setViewModalVisible={this.setViewModalVisible} image={this.state.currentImageView} isLocal={true}/>
            <View style={styles.navbar}>
                <View style={styles.backView}>
                    <TouchableOpacity onPress={this.props.navigation.goBack}>
                        <Ionicons name="chevron-back" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.headerText}>Choose a profile picture</Text>
            </View>
            <View style={styles.whiteContainer}>
                <View style={styles.line} />
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.whiteBackground}>
                        <Text style={styles.question}>We'll see this when you scan in to verify who you are!</Text>
                        <Text style={styles.subNote}>Please use a picture of yourself!</Text>
                        {
                            !this.state.profilePicture
                            ? <View style={styles.imagesView}>
                                <TouchableOpacity onPress={this.addPhoto}>
                                    <View style={styles.addImageContainer}>
                                        <View style={styles.addIconContainer}>
                                            <View style={{borderRadius: Dimensions.get('window').height * .03, backgroundColor: Color.MAIN}} >
                                                <Ionicons name="add" style={styles.addIcon} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                </View>
                            : <View style={styles.imagesView}>
                                <TouchableOpacity onPress={() => this.photoActionButton()} style={styles.imageContainer}>
                                <BetterImage style={styles.image} source={{uri: this.state.profilePicture.uri}} />
                            </TouchableOpacity>
                            </View>
                        }
                        
                        {
                            this.state.profilePicture
                            ? <Text style={styles.hint}>* Click to view or delete.</Text>
                            : null
                        }
                        {
                            this.state.errorMessage != ""
                            ? <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                            : null
                        }
                    </View>
                    
                    {
                        !this.state.profilePicture || this.state.loadingData
                        ?   <View style={[styles.button, styles.button2]}>
                                <Text style={[styles.buttonText, styles.buttonText2]}>Continue</Text>
                            </View>
                        :   <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                                <TouchableOpacity onPress={this.nextPage}>
                                    <Text style={styles.buttonText}>Continue</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                    }
                    <View style={{marginBottom: Dimensions.get('window').height * .3}} />
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
    hint: {
        marginTop: Dimensions.get('window').height * .01,
        fontSize: Dimensions.get('window').height * .013,
        color: "rgba(0,0,0,.2)",
        textAlign: "center",
        fontFamily: "QuicksandMedium"
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
        marginBottom: Dimensions.get('window').height * .015,
        fontFamily: 'QuicksandBold',
        fontSize: Dimensions.get('window').height * .025,
        color: Color.WHITE,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2,
    },
    navbar: {
        marginTop: Dimensions.get('window').height * .02,
        marginHorizontal: Dimensions.get('window').height * .015,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .035,
        color: Color.WHITE
    },
    question: {
        marginBottom: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .017,
        color: Color.HEADER,
    },
    subNote: {
        marginBottom: Dimensions.get('window').height * .01,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .013,
        color: Color.HEADER,
        opacity: 0.7
    },
    imagesView: {
        width: Dimensions.get('window').width,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: Dimensions.get('window').width * .01,
        marginRight: Dimensions.get('window').width * .1,
    },
    imageContainer: {
        marginHorizontal: Dimensions.get('window').width * .025,
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        borderRadius: (Dimensions.get('window').width * 0.7) / 2,
        borderWidth: 3,
        borderColor: Color.MAIN,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.025,
        alignSelf: 'center', // Center the container
        shadowColor: Color.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    image: {
        width: Dimensions.get('window').width * .67,
        height: Dimensions.get('window').width * .67,
        borderRadius: 10,
        margin: Dimensions.get('window').width * .008,
        borderRadius: (Dimensions.get('window').width * .7) / 2,
    },
    addImageContainer: {
        marginHorizontal: Dimensions.get('window').width * .025,
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 0.7,
        borderRadius: (Dimensions.get('window').width * 0.7) / 2,
        borderWidth: 3,
        borderColor: Color.MAIN,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Dimensions.get('window').height * 0.025,
        alignSelf: 'center', // Center the container
        shadowColor: Color.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: Color.MEDIUM_BORDER,
    },
    addIconContainer: {
        opacity: .8,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').width * .7,
        width: Dimensions.get('window').width * .7,
    },
    addIcon: {
        fontSize: Dimensions.get('window').height * .018,
        color: Color.WHITE,
        paddingVertical: Dimensions.get('window').height * .0015,
        paddingLeft: Dimensions.get('window').height * .002,
        paddingRight: Dimensions.get('window').height * .001,
    },
    hint: {
        marginTop: Dimensions.get('window').height * .01,
        fontSize: Dimensions.get('window').height * .012,
        color: "rgba(0,0,0,.2)",
        textAlign: "center",
        fontFamily: "QuicksandMedium",
    },
    errorMessage: {
        marginTop: Dimensions.get('window').height * .03,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .015,
        color: Color.ERROR,
        fontFamily: "QuicksandMedium"
    }
})

export default AddPictureScreen