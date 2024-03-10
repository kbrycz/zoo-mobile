import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as Color from '../../../global/colors';
import { getTimestamp } from '../../functions/GetTimeAgo'; // Assuming you have a function to format the date nicely
import ScaleView from '../general/ScaleView';

const RewardComponent = ({ reward }) => {

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };

    // Assuming reward object has title, description, image (URL), and createdAt properties
    return (
        <ScaleView>
        <View style={styles.container}>
            <Text style={styles.title}>{reward.title}</Text>
            <Text style={styles.points}>{reward.points} points (redeem with QR code at zoo)</Text>
            <Image
                source={require('../../../assets/main/rewards.jpeg')}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
        </ScaleView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width * .9,
        marginHorizontal: Dimensions.get('window').width * .05,
        marginVertical: Dimensions.get('window').height * .01,
        backgroundColor: Color.WHITE,
        shadowColor: 'rgba(0,0,0,.4)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingVertical: Dimensions.get('window').height * .04,
        paddingHorizontal: Dimensions.get('window').width * .05,
        borderRadius: 10
    },
    headerContainer: {
        flexDirection: 'row'
    },
    headerTextContainer: {
        flex: 4,
        marginTop: Dimensions.get('window').height * .005, 
        paddingHorizontal: Dimensions.get('window').width * .02,
    },
    title: {
        fontFamily: "QuicksandSemiBold",
        fontSize: Dimensions.get('window').height * .02, 
        marginBottom: Dimensions.get('window').height * .005, 
        color: Color.HEADER,
        marginBottom: Dimensions.get('window').height * .01, 
    },
    points: {
        fontSize: Dimensions.get('window').height * .015,
        marginBottom: Dimensions.get('window').height * .02, 
        color: Color.HEADER,
        opacity: .6,
        fontFamily: "QuicksandMedium"
    },
    imageContainer: {
        flex: 1,
        shadowColor: 'rgba(0,0,0,.2)',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 1,
    },
    image: {
        width: Dimensions.get('window').width * .8,
        height: Dimensions.get('window').height * .25,
    },
});

export default RewardComponent;
