import React, { useState } from 'react'
import {StyleSheet, ActivityIndicator, Image, View, Animated, Easing} from 'react-native'
import * as Color from '../../../global/colors'
import CachedImage from 'expo-cached-image'

// A Better image loader to use
const BetterImage = ({isWhite, isHere, cacheKey, onLoad, onError, ...rest}) => {

    // Variables for component
    const [scale, setScale] = useState(new Animated.Value(0))
    const [isLoaded, setIsLoaded] = useState(false)

    // Animates the photo
    const animatePhoto = () => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: false  // <-- neccessary
          }).start();
    }

    return <View>
                <Animated.View style={{ 
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: [{scale: scale}],
                    zIndex: 1
                    }}>
                    {
                        !cacheKey
                        ?  <Image  
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src='../../../assets/placeholder/profile.png';
                            }} 
                            onLoad={event => {
                                onLoad?.(event);
                                animatePhoto()
                                setIsLoaded(true);
                            }} 
                            {...rest} />
                        : <CachedImage  
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src='../../../assets/placeholder/profile.png';
                            }}
                            cacheKey={`${cacheKey}-thumb`}
                            onLoad={event => {
                                onLoad?.(event);
                                animatePhoto()
                                setIsLoaded(true);
                            }} 
                            {...rest} />
                    }

                </Animated.View>
                    {
                        !isLoaded && (
                            <View style={[StyleSheet.absoluteFill, styles.spinner]}>
                                <ActivityIndicator
                                    animating={true}
                                    size="small"
                                    color={isWhite ? Color.WHITE : Color.MAIN}
                                />
                            </View>
                        )
                    }
            </View>
}

const styles = StyleSheet.create({
    spinner: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default BetterImage;