import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as Color from '../../../global/colors';
import { getTimestamp } from '../../functions/GetTimeAgo'; // Assuming you have a function to format the date nicely
import ScaleView from '../general/ScaleView';

const PostComponent = ({ post }) => {

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };

    // Assuming post object has title, description, image (URL), and createdAt properties
    return (
        <ScaleView>
            <View style={styles.container}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.date}>{formatDate(post.date)}</Text>
                <Image
                    source={require('../../../assets/main/event.jpeg')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Text style={styles.description}>{post.description}</Text>
                <TouchableOpacity style={styles.helpButton}>
                    <Text style={styles.helpButtonText}>Learn More</Text>
                </TouchableOpacity>
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
    date: {
        fontSize: Dimensions.get('window').height * .015,
        marginBottom: Dimensions.get('window').height * .02, 
        color: Color.HEADER,
        opacity: .4,
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
    description: {
        fontFamily: "QuicksandMedium",
        fontSize: Dimensions.get('window').height * .014,
        lineHeight: Dimensions.get('window').height * .026,
        marginTop: Dimensions.get('window').height * .02,
        color: Color.TEXT
    },
    helpButtonText: {
        fontSize: Dimensions.get('window').height * .015,
        color: Color.MAIN,
        textAlign: "center",
        fontFamily: "QuicksandSemiBold"
    },
    helpButton: {
        borderColor: Color.MAIN,
        borderWidth: 1,
        paddingVertical: Dimensions.get('window').height * .015,
        borderRadius: 5,
        marginTop: Dimensions.get('window').height * .02,
        width: Dimensions.get('window').width * .8,
    },
});

export default PostComponent;
