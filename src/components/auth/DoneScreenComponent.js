
import { LinearGradient } from "expo-linear-gradient"
import React, { useEffect, useState } from "react"
import {Animated, StyleSheet, View, Text, Easing, Dimensions, SafeAreaView, Platform, StatusBar} from "react-native"
import * as Color from "../../../global/colors"

// The screen that shows all done page
const DoneScreenComponent = ({getStarted}) => {

    const [opacity, setOpacity] = useState(new Animated.Value(0))
    const [height, setHeight] = useState(new Animated.Value(0))
    const [startAnimation, setStartAnimation] = useState(new Animated.Value(0))

    // Runs all animations when component loads
    useEffect(() => {
        Animated.timing(startAnimation, {
            toValue: Dimensions.get('window').height,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false  // <-- neccessary
        }).start(() => {
            setTimeout(() => {
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: false  // <-- neccessary
                  }).start(() => {
                      setTimeout(() => {
                          getStarted()
                      }, 1000);
                  });
            }, 1000);
        })
    }, [])

    return (
        <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
            <SafeAreaView style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0}}>
                <Animated.View style={[StyleSheet.absoluteFill, {opacity: opacity, alignItems: 'center', justifyContent: 'center'}]}>
                    <Text style={styles.headerText}>All Done.</Text>
                </Animated.View>
                <Animated.View style={[styles.whiteContainer, {
                        zIndex: 1,
                        transform: [
                            {translateY: startAnimation}
                        ]
                    }]} >
                        <View >
                            <View style={styles.line} />
                        </View>
                    </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    
      )
}

const styles = StyleSheet.create({
    grad: {
        height: Dimensions.get('window').height
      },
    container: {
        marginTop: Dimensions.get('window').height * .05,
        marginHorizontal: Dimensions.get('window').width * .075,
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
    headerText: {
        textAlign: 'center',
        fontFamily: 'QuicksandBold',
        paddingBottom: 100,
        fontSize: Dimensions.get('window').height * .03,
        color: Color.WHITE,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 2,
    },
  });

  export default DoneScreenComponent