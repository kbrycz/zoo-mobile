  
import React from 'react'
import {StyleSheet, View, Dimensions, TouchableOpacity, Text, Image, Animated, Easing} from 'react-native'
import * as Color from '../../../global/colors'
import { LinearGradient } from 'expo-linear-gradient';
import ScaleView from './ScaleView';

// The empty container component with frown face
const EmptyContainerComponent = ({headerText, subHeaderText, hasButton, buttonFunc, buttonText, avoidScale}) => {

    if (hasButton) {
        if (avoidScale) {
            return (
              <View style={styles.noPostsContainer}>
                <View style={styles.imageContainer}>
                    <Image
                    style={styles.image} 
                    source={require('../../../assets/general/sadFace.png')}
                    />
                </View>
                <Text style={styles.noPosts}>{headerText}</Text>
                {
                    subHeaderText
                    ? <Text style={styles.swipeText2}>{subHeaderText}</Text>
                    : null
                }
                <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                  <TouchableOpacity onPress={buttonFunc}>
                      <Text style={styles.buttonText}>{buttonText}</Text>
                  </TouchableOpacity>
                </LinearGradient>
            </View>
            )
        }
        return (
          <ScaleView>
            <View style={styles.noPostsContainer}>
                <View style={styles.imageContainer}>
                    <Image
                    style={styles.image} 
                    source={require('../../../assets/general/sadFace.png')}
                    />
                </View>
                <Text style={styles.noPosts}>{headerText}</Text>
                {
                    subHeaderText
                    ? <Text style={styles.swipeText2}>{subHeaderText}</Text>
                    : null
                }
                <LinearGradient style={styles.button} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3]} start={{ x: 0.5, y: .1 }} end={{ x: .5, y: .9 }}>
                  <TouchableOpacity onPress={buttonFunc}>
                      <Text style={styles.buttonText}>{buttonText}</Text>
                  </TouchableOpacity>
                </LinearGradient>
            </View>
          </ScaleView>
        )
    }
    else {
          if (avoidScale) {
            return (
              <View style={styles.noPostsContainer}>
                  <View style={styles.imageContainer}>
                      <Image
                      style={styles.image} 
                      source={require('../../../assets/general/sadFace.png')}
                      />
                  </View>
                  <Text style={styles.noPosts}>{headerText}</Text>
                  {
                      subHeaderText
                      ? <Text style={styles.swipeText}>{subHeaderText}</Text>
                      : null
                  }
              </View>
            )
        }
        return (
          <ScaleView>
              <View style={styles.noPostsContainer}>
                  <View style={styles.imageContainer}>
                      <Image
                      style={styles.image} 
                      source={require('../../../assets/general/sadFace.png')}
                      />
                  </View>
                  <Text style={styles.noPosts}>{headerText}</Text>
                  {
                      subHeaderText
                      ? <Text style={styles.swipeText}>{subHeaderText}</Text>
                      : null
                  }
              </View>
          </ScaleView>
          
        )
    }
    
}

const styles = StyleSheet.create({
    noPostsContainer: {
        marginTop: Dimensions.get('window').height * .05,
        marginBottom: Dimensions.get('window').height * .05,
        backgroundColor: Color.WHITE,
        marginHorizontal: Dimensions.get('window').width * .05,
        width: Dimensions.get('window').width * .8,
        borderRadius: 5,
        shadowColor: Color.BLACK,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 5,
        alignItems: 'center'
      },
      imageContainer: {
        marginTop: Dimensions.get('window').height * .05,
        width: Dimensions.get('window').width * .3,
        height: Dimensions.get('window').width * .3,
        marginBottom: Dimensions.get('window').height * .02,
      },
      image: {
        width: '100%',
        height: '100%',
        resizeMode:'contain',
      },
      noPosts: {
        fontFamily: 'QuicksandBold',
        textAlign: 'center',
        marginHorizontal: Dimensions.get('window').width * .1,
        fontSize: Dimensions.get('window').height * .02,
        color: Color.MAIN,
        lineHeight: Dimensions.get('window').height * .04,
      },
      swipeText: {
        fontFamily: 'QuicksandMedium',
        marginTop: Dimensions.get('window').height * .03,
        marginHorizontal:  Dimensions.get('window').width * .12,
        marginBottom: Dimensions.get('window').height * .05,
        fontSize: Dimensions.get('window').height * .015,
        lineHeight:  Dimensions.get('window').height * .03,
        textAlign: 'center',
        color: Color.HEADER,
        opacity: .5
    },
    swipeText2: {
        fontFamily: 'QuicksandMedium',
        marginTop: Dimensions.get('window').height * .03,
        marginHorizontal:  Dimensions.get('window').width * .15,
        fontSize: Dimensions.get('window').height * .015,
        lineHeight:  Dimensions.get('window').height * .03,
        textAlign: 'center',
        color: Color.HEADER,
        opacity: .5
    },
    button: {
      marginTop: Dimensions.get('window').height * .05,
      marginHorizontal: Dimensions.get('window').width * .1,
      marginBottom: Dimensions.get('window').height * .05,
      width: Dimensions.get('window').width * .6,
      borderRadius: 5,
      padding: Dimensions.get('window').height * .02,
    },
    buttonText: {
      fontSize: Dimensions.get('window').height * .015,
      textAlign: 'center',
      fontFamily: "QuicksandBold",
      color: Color.WHITE,
    },
})

export default EmptyContainerComponent;