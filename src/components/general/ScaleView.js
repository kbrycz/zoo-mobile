import React, { useEffect, useState } from 'react'
import {StyleSheet, Animated, Easing} from 'react-native'


// A view that scales in it's children
const ScaleView = ({children}) => {

    // Component variables
    const [scale, setScale] = useState(new Animated.Value(0))

    // Animates the scaling in
    const scaleView = () => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false  // <-- neccessary
          }).start();
    }

    // Calls the scale on start
    useEffect(() => {
        scaleView()
    }, [])

    return (
        <Animated.View style={{
                transform: [{scale: scale}],
                zIndex: 1
            }}>
            {children}
        </Animated.View>

    )
}

const styles = StyleSheet.create({
})

export default ScaleView