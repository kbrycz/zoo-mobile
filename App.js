import * as React from 'react';
import { StyleSheet, Image, Dimensions, View, Platform, Text, TextInput } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreenExpo from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import {FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as Color from './global/colors'
import * as Haptics from 'expo-haptics';
import SplashScreen from './src/splash/SplashScreen';
import AuthScreen from './src/screens/auth/AuthScreen';
import PhoneNumberScreen from './src/screens/auth/PhoneNumberScreen';
import VerifyPhoneScreen from './src/screens/auth/VerifyPhoneScreen';
import EnterNameScreen from './src/screens/auth/EnterNameScreen';
import EnterPreferencesScreen from './src/screens/auth/EnterPreferencesScreen';
import AddPictureScreen from './src/screens/auth/AddPictureScreen';
import FinalPageScreen from './src/screens/auth/FinalPageScreen';
import DoneScreen from './src/screens/auth/DoneScreen';

// Creates stack for the Authentication screens
const Auth = createStackNavigator();
const AuthStack = () => {
  return (
    <Auth.Navigator 
        initialRouteName="AuthScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Auth.Screen name="AuthScreen" component={AuthScreen} />
        <Auth.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} />
        <Auth.Screen name="VerifyPhoneScreen" component={VerifyPhoneScreen} />
        <Auth.Screen name="EnterNameScreen" component={EnterNameScreen} />
        <Auth.Screen name="EnterPreferencesScreen" component={EnterPreferencesScreen} />
        <Auth.Screen name="AddPictureScreen" component={AddPictureScreen} />
        <Auth.Screen name="FinalPageScreen" component={FinalPageScreen} />
    </Auth.Navigator>
  )
}

// Creates stack for the Profile slide screens
const MainStack = createStackNavigator();
const MainStackScreen = () => {
  return (
    <MainStack.Navigator 
      initialRouteName="Tab"
      screenOptions={{
        headerShown: false,
      }}>
        <MainStack.Screen name="DoneScreen" component={DoneScreen} />
    </MainStack.Navigator>
  )
}


const RootStack = createStackNavigator();

class App extends React.Component {

  // Initialize the App Screen state
  constructor() {
    super();
    this.state = {
      loading: true,
      hasToken: false,
    };
  }

  componentDidMount() {
    this.loadEverything()
  }

  // Loads everything before the app starts
  loadEverything = async () => {

    await SplashScreenExpo.hideAsync()

    console.log("Loading all assets")

    // Fixes the problem with accessibility settings
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;

    AsyncStorage.getItem('token').then((token) => {
      this.setState({ hasToken: token !== null, loading: false})
    })
  
    // Loads all the images
    await Asset.loadAsync([
      require('./assets/auth/light-logo.png'),
      require('./assets/general/centerButton.png'),
      require('./assets/general/centerButtonFocused.png'),
    ]);

    // Loads all the fonts
    await Font.loadAsync({
      'QuicksandMedium': require('./assets/fonts/Quicksand-Medium.ttf'),
      'QuicksandSemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
      'QuicksandBold': require('./assets/fonts/Quicksand-Bold.ttf'),
    });

    this.setState({loading: false})
  }

  // Allows for fading between screens
  forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  // Renders the jsx for the UI
  render() {

    return <SplashScreen>
              {
                this.state.loading
                ? <View />
                : <NavigationContainer>
                    <RootStack.Navigator screenOptions={{
                        headerShown: false,
                        animationEnabled: true,
                        cardStyleInterpolator: this.forFade,
                        gestureEnabled: false
                      }}>              
                      { 
                        !this.state.hasToken 

                        ? <>
                            <RootStack.Screen name='Auth' component={AuthStack} />
                            <RootStack.Screen name='Main' component={MainStackScreen} />
                          </>
                        : <>
                            <RootStack.Screen name='Main' component={MainStackScreen} />
                            <RootStack.Screen name='Auth' component={AuthStack} />
                          </>
                      }
                  </RootStack.Navigator>
                </NavigationContainer>  
              }
            </SplashScreen>
  }
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width * .13,
    height: Dimensions.get('window').height * .075,
  },
  circle: {
    backgroundColor: "#fff",
    marginBottom: Dimensions.get('window').width * .07,
    paddingLeft: Dimensions.get('window').height * .005,
    width: Dimensions.get('window').height * .105,
    height: Dimensions.get('window').height * .105,
    borderRadius: Dimensions.get('window').width * .25,
    backgroundColor: Color.WHITE,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    shadowColor: Platform.OS === 'ios' ? "#000": "#999",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  circleHighlighted: {
    backgroundColor: Color.MAIN
  }
})

export default function(props) {
    return <App {...props} />
}