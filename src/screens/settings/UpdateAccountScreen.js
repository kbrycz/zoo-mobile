import * as React from 'react';
import { StyleSheet, Dimensions, Text, TouchableOpacity,
         SafeAreaView, View, ScrollView,
         TextInput, Keyboard, InteractionManager, Platform, StatusBar, ActivityIndicator} from 'react-native';
import api from '../../api/server'
import * as Color from '../../../global/colors';
import { Store } from '../../redux/store';
import { setUser } from '../../redux/actions';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import DatePicker from '@react-native-community/datetimepicker';
import ScaleView from '../../components/general/ScaleView';

// Screen to update the individual account item
class UpdateAccountScreen extends React.Component {
    
  // Initialize the Profile Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
      loadingData: false,
      user: {},
      token: null,
      typeOfChange: -1,
      hasFound: false,
      first: "",
      last: "",
      profilePhoto: null,
      birthdate: new Date(),
      gender: -1,
      errorMessage: "",
      successMessage: "",
      focusedBox: -1,
    }
  } 

  // Load everything after the component loads
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
        this.loadEverything()
    })
  }

  // Set the hasfound variable
  setHasFound = (val) => {
      this.setState({hasFound: val})
  }

  // Sets the first variable
  setFirst = (f) => {
      this.setState({first: f})
  } 

  // Sets the first variable
  setLast = (l) => {
    this.setState({last: l})
  }

// Sets the gender variable
setProfilePhoto = (p) => {
    this.setState({profilePhoto: p})
}

  // Sets the first variable
  setBirthdate = (d) => {
    this.setState({birthdate: d})
  } 

  // Sets the gender variable
  setGender = (g) => {
      this.setState({gender: g})
  }

  // Updates the appropriate data field based on the screen the user is viewing
  // typeOfChange: 0 = name, 1 = location (zip), 2 = birthdate -1 = nothing
  updateData = () => {
    switch(this.state.typeOfChange) {
        case 0:
            this.updateName()
            return
        case 1:
            this.updateProfilePhoto()
            return
        case 2:
            this.updateBirthdate()
            return
        case 3:
            this.updateGender()
        default:
            return
    }
  }

  // Updates the first and last name of the user
  updateName = async () => {
    this.setState({loadingData: true, successMessage: "", errorMessage: ""})
    const authStr = 'Bearer '.concat(this.state.token); 
    Keyboard.dismiss()
    try {
        const response = await api.post('/changeName', {first: this.state.first.trim(), last: this.state.last.trim()}, {headers: {Authorization: authStr}})
        if (!response) {
            throw "error in updating name"
        }
        this.updateUser(response.data.user)
        this.setState({
            loadingData: false,
            first: response.data.user.first,
            last: response.data.user.last,
            successMessage: "Successfully updated your name",
            errorMessage: ""
        })
    }
    catch (err) {
        console.log(err)
        this.setState({
            loadingData: false,
            errorMessage: "Unable to update your name",
            successMessage: ""
        })
    }
  }

  // Updates the birthdate of the user on the server
  updateBirthdate = async () => {
    this.setState({loadingData: true, successMessage: "", errorMessage: ""})
    const authStr = 'Bearer '.concat(this.state.token); 
    try {
        const response = await api.post('/changeBirthdate', {birthdate: this.state.birthdate.toString()}, {headers: {Authorization: authStr}})
        if (!response) {
            throw "error in updating birthdate"
        }
        this.updateUser(response.data.user)
        this.setState({
            loadingData: false,
            birthdate: new Date(response.data.user.birthdate),
            successMessage: "Successfully updated your birthdate",
            errorMessage: ""
        })
    }
    catch (err) {
        console.log(err)
        this.setState({
            loadingData: false,
            errorMessage: "Unable to update your birthdate",
            successMessage: ""
        })
    }
  }

    // Updates the profile picture of the user on the server
    updateProfilePhoto = async () => {
        this.setState({loadingData: true, successMessage: "", errorMessage: ""})
        const authStr = 'Bearer '.concat(this.state.token); 
        try {
            const response = await api.post('/changeProfilePhoto', {profilePhoto: this.state.profilePhoto}, {headers: {Authorization: authStr}})
            if (!response) {
                throw "error in updating profile photo"
            }
            this.updateUser(response.data.user)
            this.setState({
                loadingData: false,
                profilePhoto: response.data.user.profilePhoto,
                successMessage: "Successfully updated your profile picture",
                errorMessage: ""
            })
        }
        catch (err) {
            console.log(err)
            this.setState({
                loadingData: false,
                errorMessage: "Unable to update your profile picture",
                successMessage: ""
            })
        }
      }

  // Updates the gender of the user
  updateGender = async () => {
    this.setState({loadingData: true, successMessage: "", errorMessage: ""})
    const authStr = 'Bearer '.concat(this.state.token); 
    try {
        const response = await api.post('/changeGender', {gender: this.state.gender}, {headers: {Authorization: authStr}})
        if (!response) {
            throw "error in updating gender"
        }
        this.updateUser(response.data.user)
        this.setState({
            loadingData: false,
            gender: this.state.gender,
            successMessage: "Successfully updated your gender",
            errorMessage: ""
        })
    }
    catch (err) {
        console.log(err)
        this.setState({
            loadingData: false,
            errorMessage: "Unable to update your gender",
            successMessage: ""
        })
    }
  }

  // If the zip code box is focused 
  isFocused = (val) => {
      if (this.state.focusedBox === val) {
          return {
              borderWidth: 2,
              borderColor: Color.MAIN,
              marginBottom: 0
          }
      }
      else {
          return {
                marginBottom: 2
          }
      }
  }

  // Gets the UI for changing name
  getNameUI = () => {
    return <View style={styles.container}>
                <Text style={styles.titleText}>First Name</Text>
                <TextInput
                    autoCapitalize='words'
                    autoFocus
                    onFocus={() => this.setState({focusedBox: 0})}
                    onBlur={() => this.setState({focusedBox: -1})}
                    onSubmitEditing={() => { this.lastNameField.focus(); }}
                    autoCompleteType="name"
                    keyboardType="default"
                    textContentType='givenName'
                    autoCorrect={true}
                    style={[styles.textInput, this.isFocused(0)]}
                    returnKeyType="done"
                    value={this.state.first}
                    placeholder='First'
                    maxLength={12}
                    onChangeText={this.setFirst} />
                <Text style={[styles.titleText, {marginTop: Dimensions.get('window').height *.03}]}>Last Name</Text>
                <TextInput  
                    autoCapitalize='words'
                    onFocus={() => this.setState({focusedBox: 1})}
                    onBlur={() => this.setState({focusedBox: -1})}
                    ref={(input) => { this.lastNameField = input; }}
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    autoCompleteType="name"
                    keyboardType="default"
                    textContentType='familyName'
                    autoCorrect={true}
                    style={[styles.textInput, this.isFocused(1)]}
                    returnKeyType="done"
                    value={this.state.last}
                    placeholder='Last'
                    maxLength={12}
                    onChangeText={this.setLast} />
            </View>
  }

  getProfilePhotoUI = () => {
    return <>
    <Text style={styles.titleText}>Profile Picture</Text>
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
    </>
  }

  // Gets the birthdate UI set up
  getBirthdateUI = () => {
    const birthdate = this.state.birthdate instanceof Date ? this.state.birthdate : new Date();
    return <View style={styles.container}>
        <Text style={styles.titleText}>Birthdate</Text>
        <DatePicker
            textColor="rgba(0,0,0,.9)"
            display={"spinner"}
            maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))}
            minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 99))}
            style={styles.datePickerStyle}
            value={birthdate} // Use safeguarded birthdate
            mode="date" //The enum of date, datetime and time
            onChange={(event, date) => {
                this.setState({birthdate: date || this.state.birthdate}); // Fallback to current state if date is undefined
            }}
        />
    </View>
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

  // Changes highlighted bubbles text to purple and resets margin
  getHighlightedText = (current, compare) => {
    if (compare === current) {
        return {
            color: Color.MAIN,
            marginBottom: 0
        }
    }
  }
  
  // Gets the UI for changing name
  getGenderUI = () => {
    return <View style={styles.container}>
        <Text style={styles.titleText}>I identify as</Text>
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
  }

  // Gets the correct type of UI to show to the user
  // info: 0 = name, 1 = number, 2 = birthdate
  getCorrectType = () => {
      switch (this.state.typeOfChange) {
          case 0:
              return this.getNameUI()
          case 1:
              return this.getProfilePhotoUI()
          case 2: 
              return this.getBirthdateUI()
          case 3:
              return this.getGenderUI()
          default:
              return null
      }
  }

  // Load everyting from the state store and params
  loadEverything = async () => {
      console.log("loading everything for Update Account screen")
      let user = Store.getState().user
      this.setState({
        typeOfChange: this.props.route.params.typeOfChange,
        token: this.props.route.params.token,
        user: user,
        first: user.first,
        gender: user.gender,
        last: user.last,
        birthdate: new Date(user.birthdate),
      }, () => this.setState({loading: false}))
  }

  // Gets the header text
  getHeaderText = () => {
      if (this.props.route.params.typeOfChange === 0) {
          return <Text style={styles.headerText}>Edit Name</Text>
      }
      else if (this.props.route.params.typeOfChange === 1) {
        return <Text style={styles.headerText}>Edit Profile Picture</Text>
      }
      else if (this.props.route.params.typeOfChange === 2) {
        return <Text style={styles.headerText}>Edit Birthdate</Text>
      }
      else if (this.props.route.params.typeOfChange === 3) {
        return <Text style={styles.headerText}>Edit Gender</Text>
      }
      else {
          return <Text style={styles.headerText}>Edit Information</Text>
      }
  }

  // Updates the user object
  updateUser = (user) => {
    this.setState({user: user})
    Store.dispatch(setUser(user))
  }

  // Renders the jsx for the UI
  render() {
    if (this.state.loading) {
        return <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
                <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                    <View style={styles.backView}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} disabled={this.state.loadingData}>
                            <Ionicons name="chevron-back" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textContainer}>
                        {this.getHeaderText()}
                    </View>
                    <View style={styles.whiteContainer}>
                        <View style={styles.line} />
                        <LoadingIndicator isBottomScreen={true} loadingData={this.state.loading} />
                    </View>
                </SafeAreaView>
            </LinearGradient>
    }
    return (
      <SafeAreaView>
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
            <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                <View style={styles.backView}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} disabled={this.state.loadingData}>
                        <Ionicons name="chevron-back" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    {this.getHeaderText()}
                </View>
                <View style={styles.whiteContainer}>
                    <View style={styles.line} />
                    <ScrollView style={styles.sv}>
                        <View style={styles.mainContainer}>
                            <ScaleView>
                                <View style={styles.whiteBackground}>
                                    {this.getCorrectType()}
                                </View>
                            </ScaleView>
                            
                            {
                                this.state.errorMessage === ''
                                ? null
                                : <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                            }
                            {
                                this.state.successMessage === ''
                                ? null
                                : <Text style={styles.successMessage}>{this.state.successMessage}</Text>
                            }
                            {
                                this.state.typeOfChange == 1 && !this.state.hasFound
                                ? null
                                : <ScaleView>
                                {
                                    this.state.loadingData
                                    ? <View style={styles.button}>
                                        <ActivityIndicator
                                                    animating={true}
                                                    size="small"
                                                    color={Color.MAIN}
                                                />
                                        </View>
                                    :   <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                                            <TouchableOpacity onPress={this.updateData}>
                                                <Text style={styles.buttonText}>Update</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                }
                                <TouchableOpacity style={styles.button2} onPress={() => {this.props.navigation.goBack()}}>
                                    <Text style={styles.buttonText2}>Cancel</Text>
                                </TouchableOpacity>
                                </ScaleView>
                            }
                            
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    whiteContainer: {
        backgroundColor: Color.BACKGROUND,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        height: '100%'
    },
    whiteBackground: {
        marginVertical: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').height * .04,
        paddingHorizontal: Dimensions.get('window').width * .04,
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
    },
    container: {
        marginHorizontal: Dimensions.get('window').width * .025,
    },
    titleText: {
        fontFamily: 'QuicksandSemiBold',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.HEADER,
        marginBottom: Dimensions.get('window').height * .02,
    },
    textInput: {
        padding: Dimensions.get('window').height * .02,
        fontSize: Dimensions.get('window').height * .015,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(0, 0, 0, .1)',
        fontFamily: 'QuicksandMedium',
    },
    button: {
        marginTop: Dimensions.get('window').height * .01,
        marginHorizontal: Dimensions.get('window').width * .075,
        marginBottom: Dimensions.get('window').height * .015,
        padding: Dimensions.get('window').height * .02,
        borderRadius: 5,
    },
    buttonText: {
        fontFamily: 'QuicksandBold',
        fontSize: Dimensions.get('window').height * .015,
        textAlign: 'center',
        color: Color.WHITE,
    },
    button2: {
        marginHorizontal: Dimensions.get('window').width * .075,
        padding: Dimensions.get('window').height * .02,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Color.MAIN,
        marginBottom: Dimensions.get('window').height * .5,
    },
    buttonText2: {
        fontFamily: 'QuicksandBold',
        fontSize: Dimensions.get('window').height * .015,
        textAlign: 'center',
        color: Color.MAIN,
    },
    errorMessage: {
        fontFamily: 'QuicksandMedium',
        marginTop: Dimensions.get('window').height * .02,
        marginBottom: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .015,
        color: Color.ERROR
    },
    successMessage: {
        fontFamily: 'QuicksandMedium',
        marginTop: Dimensions.get('window').height * .02,
        marginBottom: Dimensions.get('window').height * .02,
        textAlign: 'center',
        fontSize: Dimensions.get('window').height * .015,
        color: Color.MAIN
    },
    datePickerStyle: {
        marginRight: Dimensions.get('window').width * .05,
    },
    takenContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * .01,
        marginBottom: Dimensions.get('window').height * .02,
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
    cityTitle: {
        marginBottom: Dimensions.get('window').height * .03,
        fontFamily: 'QuicksandSemiBold',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.MAIN,
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
})

export default UpdateAccountScreen
