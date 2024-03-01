import * as React from 'react';
import { View, Dimensions, StyleSheet, 
        Text, SafeAreaView, TextInput, Platform, StatusBar, Keyboard} from 'react-native';
import LoadingIndicator from '../../components/general/LoadingIndicator';
import * as Color from '../../../global/colors'
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from '@react-native-community/datetimepicker';
import HideKeyboard from '../../components/general/HideKeyboard';

// Screen to enter your name and birthdate for sign up
class EnterNameScreen extends React.Component {

  // Initialize the Enter Name Screen state
  constructor() {
    super()
    this.state = {
      loading: true,
      loadingData: false,
      first: "",
      last: "",
      focusedBox: -1,
      show: false,
      date: new Date()
    }
  } 

  // Set the value of the first name
  setFirst = (name) => {
      this.setState({first: name})
  }

  // Set the value of the last name
  setLast = (name) => {
    this.setState({last: name})
  }
  
  // When the date is changed
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    console.log(selectedDate)
    this.setState({
        show: Platform.OS === 'ios',
        date: currentDate
    });
  };

  // Loads everything when the component loads
  componentDidMount() {
    this.loadEverything()
  }

  // Loads all of the asyncs before showing page
  loadEverything = async () => {
    let tempDate = new Date()
    tempDate.setFullYear(tempDate.getFullYear() - 18)
    this.setState({
        date: tempDate,
        loading: false,
        show: Platform.OS === 'ios'
    })
  }

  // Checks if the text input is focused
  isFocused = (val) => {
      if (val === this.state.focusedBox) {
          return {
            borderColor: Color.MAIN,
            borderWidth: 2,
            marginBottom: 0,
          }
      }
      else if (this.state.focusedBox > -1) {
          return {
            marginBottom: 0,
          }
      }
      else {
          return {
            marginBottom: 2,
          }
      }
  }

  // Sends user to the preferences screen
  nextPage = () => {
      let obj = {
          first: this.state.first.trim(),
          last: this.state.last.trim(),
          birthdate: this.state.date.toString(),
          number: this.props.route.params.number
      }
      this.props.navigation.navigate('EnterPreferencesScreen', obj)
  }

  // Renders the jsx for the UI
  render() {
    // If the component is still loading
    if (this.state.loading) {
      return <LoadingIndicator loadingData={this.state.loading} />
    }

    // Component is done loading
    return (
        <HideKeyboard>
            <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
                <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                <View style={styles.backView}>
                    <TouchableOpacity onPress={this.props.navigation.goBack}>
                        <Ionicons name="chevron-back" style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                        <Text style={styles.headerText}>Tell us about yourself</Text>
                </View>
                <View style={styles.whiteContainer}>
                    <View style={styles.line} />
                        <ScrollView style={styles.container} onScroll={() => Keyboard.dismiss()}>
                            <View style={styles.whiteBackground}>
                                <Text style={styles.question}>What's your name?</Text>
                                <View style={styles.nameContainer}>
                                    <TextInput
                                        autoCapitalize='words'
                                        autoFocus
                                        onSubmitEditing={() => { this.lastNameInput.focus(); }}
                                        onFocus={() => this.setState({focusedBox: 0})}
                                        onBlur={() => this.setState({focusedBox: -1})}
                                        maxLength={20}
                                        autoCompleteType="name"
                                        keyboardType="default"
                                        textContentType='givenName'
                                        autoCorrect={true}
                                        style={[styles.textInput, styles.left, this.isFocused(0)]}
                                        returnKeyType="done"
                                        value={this.state.first}
                                        placeholder='First'
                                        onChangeText={this.setFirst} />
                                    <TextInput
                                        autoCapitalize='words'
                                        ref={(input) => { this.lastNameInput = input; }}
                                        onFocus={() => this.setState({focusedBox: 1})}
                                        onBlur={() => this.setState({focusedBox: -1})}
                                        maxLength={20}
                                        autoCompleteType="name"
                                        keyboardType="default"
                                        textContentType='familyName'
                                        autoCorrect={true}
                                        style={[styles.textInput, styles.right, this.isFocused(1)]}
                                        returnKeyType="done"
                                        value={this.state.last}
                                        placeholder='Last'
                                        onChangeText={this.setLast} />
                                </View>
                            </View>
                            <View style={styles.whiteBackground}>
                            <Text style={styles.question}>What's your birthday?</Text>
                                {
                                    this.state.date && Platform.OS !== 'ios'
                                    ? <Text style={styles.dateText}>{this.state.date.toDateString()}</Text>
                                    : null
                                }
                                {
                                    this.state.show
                                    ? <DatePicker
                                        textColor="rgba(0,0,0,.9)"
                                        display={Platform.OS === 'ios' ? "spinner" : "default"}
                                        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))}
                                        minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 99))}
                                        style={styles.datePickerStyle}
                                        value={this.state.date} //initial date from state
                                        mode="date" //The enum of date, datetime and time
                                        onChange={this.onChange}
                                    />
                                    : <TouchableOpacity onPress={() => this.setState({show: true})}>
                                        <Text style={styles.showBirthdate}>Select Date</Text>
                                    </TouchableOpacity>
                                }
                                <Text style={styles.hint}>* Must be over 10 to join</Text>
                            </View>
                        
                        {
                            this.state.first.length < 1 || this.state.last.length < 1
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
        </HideKeyboard>

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
        marginTop: Dimensions.get('window').height * .05,
        marginBottom: Dimensions.get('window').height * .02,
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
        marginBottom: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .018,
        color: Color.HEADER
    },
    nameContainer: {
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height * .01,
    },
    textInput: {
        flex: 1,
        padding: Dimensions.get('window').height * .02,
        fontSize: Dimensions.get('window').height * .015,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(0, 0, 0, .1)',
        fontFamily: 'QuicksandMedium',
    },
    left: {
        marginRight: Dimensions.get('window').width * .02,
    },
    right: {
        marginLeft: Dimensions.get('window').width * .02,
    },
    datePickerStyle: {
        height: Dimensions.get('window').height * .1,
        marginRight: Dimensions.get('window').width * .05,
    },
    showBirthdate: {
        marginTop: Dimensions.get('window').height * .01,
        marginBottom: Dimensions.get('window').height * .03,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .016,
        color: Color.MAIN,
        opacity: .5,
    },
    dateText: {
        marginBottom: Dimensions.get('window').height * .01,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .016,
        color: Color.HEADER,
        opacity: .3,
    },
    hint: {
        marginTop: Dimensions.get('window').height * .02,
        fontSize: Dimensions.get('window').height * .012,
        color: "rgba(0,0,0,.2)",
        textAlign: "center",
        fontFamily: "QuicksandMedium"
    }
})

export default EnterNameScreen