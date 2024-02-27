import React, { useEffect, useState } from "react"
import {Animated, StyleSheet, View, Image, Easing, Dimensions} from "react-native"
import * as Color from "../../global/colors"

// Splash screen component that shows before app loads
export default function SplashScreen({children}) {

    // Splash screen animated variables
    const [opacity, setOpacity] = useState(new Animated.Value(0))
    const [height, setHeight] = useState(new Animated.Value(0))
    const [startAnimation, setStartAnimation] = useState(new Animated.Value(0))

    // Runs animations once component loads
    useEffect(() => {
        Animated.timing(height, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false  // <-- neccessary
          }).start(() => {
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              easing: Easing.linear,
              useNativeDriver: false  // <-- neccessary
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(startAnimation, {
                        toValue: -Dimensions.get('window').width,
                        duration: 150,
                        easing: Easing.linear,
                        useNativeDriver: false  // <-- neccessary
                    }).start()
                }, 1400);
            });
          });
    }, [])

    // Sets maxHeight variable
    const maxHeight = height.interpolate({ 
        inputRange: [0, 1], 
        outputRange: [0, 1000]  // <-- value that larger than your content's height
    });

    return <View style={styles.bg}>
                <Animated.View style={[styles.bg, {
                        zIndex: 1,
                        transform: [
                            {translateX: startAnimation}
                        ]
                    }]} >
                    <Animated.View style={{ 
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: opacity, 
                        maxHeight: maxHeight ,
                        zIndex: 1
                        }}>
                        <Image
                            style={styles.image} 
                            source={require('../../assets/main/splashLogo.png')}
                            />
                    </Animated.View>
            </Animated.View>
            
            {children}
        </View>
}

const styles = StyleSheet.create({
    bg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Color.MAIN
    },
    image: {
        width: 100,
        height: 100,
    }
  });