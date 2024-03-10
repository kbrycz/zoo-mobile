  
import React, { useState, useEffect } from 'react'
import {StyleSheet, ActivityIndicator, Dimensions, View, Animated, Easing} from 'react-native'
import * as Color from '../../../global/colors'
import LottieView from 'lottie-react-native';

// Classic loading indicator used in page loads
const LoadingIndicator = ({isBottomScreen}) => {

    // Component variables
    const [opacity, setOpacity] = useState(new Animated.Value(0))

    // Fades in when component loads
    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true  // <-- neccessary
          }).start();
    }, [])

    return (
        <Animated.View style={[{ 
            opacity: opacity,
            }, styles.animationContainer]}>
            {
                isBottomScreen
                ? <View style={{marginTop: Dimensions.get('window').height * .15}} />
                : <View style={{marginTop: Dimensions.get('window').height * .4}} />
            }
            <LottieView
            autoPlay
            loop
                style={{
                width: Dimensions.get('window').height * .2,
                height: Dimensions.get('window').height * .2,
                backgroundColor: 'rgba(0,0,0,.0)',
                }}
                source={require('../../../assets/lottie/loading.json')}
            />
        </Animated.View>
    )

}

const styles = StyleSheet.create({
    animationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    activityIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
})

export default LoadingIndicator;