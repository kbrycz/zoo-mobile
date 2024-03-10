import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import * as Color from '../../../global/colors'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; 
import EmptyContainerComponent from "../general/EmptyContainerComponent";
import BetterImage from "../general/BetterImage";
import { serverName } from "../../api/serverName";

// Shows more info about the trophies
const RewardsModalComponent = ({loadLeaders, modalVisible, setModalVisible, user, leaders}) => {

    // Post variables
    const [isLeaders, setIsLeaders] = useState(false)
    const [scroll, setScroll] = useState(null)
    const [scrolling, setScrolling] = useState(false)

    const [refreshing, setRefreshing] = useState(false)

    // Sets the isLeaders back to normal state every time it loads
    useEffect(() => {
        setIsLeaders(false)
    }, [modalVisible])

  // Handles the refresh of the function
  const onRefresh = () => {
      setRefreshing(true)
      setTimeout(() => {
          loadLeaders()
          setRefreshing(false)
      }, 1000);
  }

  // Handles the scroll title bar to get on the right screen
  const handleScroll = (e) => {
    let x = e.nativeEvent.contentOffset.x
    if (x < 50) {
        setIsLeaders(false)
    } else {
        setIsLeaders(true)
    }
  }

  // Handles the button click to scroll
  const handleClickScroll = (current) => {
    setScrolling(true)
    if (current) {
      scroll.scrollTo({ x: 0 })
    }
    else {
      scroll.scrollTo({ x: Dimensions.get('window').width })
    }
    setScrolling(false)
  }

    // Cancel the post and return to home screen
    const cancel = () => {
        setModalVisible(false)
    }

    return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
                }}>
                <LinearGradient style={styles.grad} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4, Color.GRADIENT5,Color.GRADIENT6]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
                    <SafeAreaView>
                    <View style={styles.backView}>
                        <TouchableOpacity onPress={cancel}>
                            <Ionicons name="close-outline" style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textContainer}>
                            <Text style={styles.headerText}>Rewards</Text>
                            <Text style={styles.subText}>We deeply appreciate our loyal customers!</Text>
                    </View>
                    <View style={styles.whiteContainer}>
                        <View style={styles.line} />
                        {
                            !isLeaders
                            ? <View style={styles.headerTab}>
                                <LinearGradient style={styles.tab} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
                                    <TouchableOpacity>
                                        <Text style={styles.tabText}>You</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                <TouchableOpacity style={styles.tab} onPress={() => handleClickScroll(false)}>
                                    <Text style={styles.notTabText}>Leaders</Text>
                                </TouchableOpacity>
                            </View>
                            : <View style={styles.headerTab}>
                                    <TouchableOpacity style={styles.tab} onPress={() => handleClickScroll(true)}>
                                        <Text style={styles.notTabText}>You</Text>
                                    </TouchableOpacity>
                                    <LinearGradient style={styles.tab} colors={[Color.GRADIENT1, Color.GRADIENT2, Color.GRADIENT3, Color.GRADIENT4]} start={{ x: 0, y: .1 }} end={{ x: 1, y: .9 }}>
                                        <TouchableOpacity>
                                            <Text style={styles.tabText}>Leaders</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
                            </View>
                        }
                        <ScrollView ref={(node) => setScroll(node)} bounces={false} style={styles.background} horizontal pagingEnabled onScroll={handleScroll}
                                    showsHorizontalScrollIndicator={false} scrollEventThrottle={1000}>
                            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                                <View style={styles.howContainer}>
                                    <Text style={styles.howHeader}>How do these work?</Text>
                                    <Text style={styles.howText}>These rewards are a way for us to give back to our loyalest customers! Your current rewards are redeemable for prizes, and your lifetime rewards are pure bragging rights!</Text>
                                </View>
                                <View style={styles.trophyContainer}>
                                    <Ionicons name="gift" style={styles.trophies} />
                                    <Text style={styles.score}>{user.currentRewards}</Text>
                                    <Text style={styles.trophyText}>Current Rewards</Text>
                                </View>
                                <View style={styles.trophyContainer}>
                                    <Ionicons name="basket" style={styles.trophies} />
                                    <Text style={styles.score}>{user.lifetimeRewards}</Text>
                                    <Text style={styles.trophyText}>Lifetime Rewards</Text>
                                </View>
                                <View style={{marginBottom: Dimensions.get('window').height * .35}} />
                            </ScrollView>
                            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
                                            refreshControl={
                                                <RefreshControl
                                                tintColor={Color.MAIN}
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                            />}>
                                {
                                    !leaders || leaders.length == 0
                                    ? <View style={{marginHorizontal: Dimensions.get('window').width * .05, marginTop: -Dimensions.get('window').height * .03}}>
                                        <EmptyContainerComponent headerText={"Unable to Load Leaderboard!"} hasButton={true} 
                                                   buttonFunc={() => setModalVisible(false)} buttonText={"Close"} />
                                    </View>
                                    : <>
                                        <View style={[styles.howContainer, {marginBottom: Dimensions.get('window').height * .01}]}>
                                            <Text style={styles.howHeader}>Leaderboard</Text>
                                            <Text style={styles.howText}>Check out our most loyal customers! Ranked by their lifetime rewards accumulated!</Text>
                                        </View>
                                        {
                                            leaders.map((leader, index) => {
                                                return <View style={styles.leaderContainer} key={index}>
                                                    <Text style={styles.rank}>{index + 1}.</Text>
                                                    <View style={styles.imageContainer}>
                                                        <BetterImage cacheKey={user.profilePicture} style={styles.image} source={require("../../../assets/main/default.jpeg")} resizeMode="cover" />
                                                        {/* <BetterImage style={styles.image} source={{uri: serverName + leader.photo}} resizeMode="cover" /> */}
                                                    </View>
                                                    <View style={styles.leaderTextContainer}>
                                                        <Text style={styles.name}>{leader.first}</Text>
                                                    </View>
                                                    <View style={styles.chevronContainer}>
                                                        <Text style={styles.score2}>{leader.lifetimeRewards}</Text>
                                                    </View>
                                                </View> 
                                            })
                                        }
                                    </>
                                }
                                <View style={{marginBottom: Dimensions.get('window').height * .35}} />
                            </ScrollView>
                        </ScrollView>
                    </View>
                    </SafeAreaView>
                </LinearGradient>
            </Modal>
    );
};

const styles = StyleSheet.create({
    grad: {
        height: Dimensions.get('window').height
    },
    container: {
        marginVertical: Dimensions.get('window').height * .02,
        width: Dimensions.get('window').width,
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
    textContainer: {
        marginTop: Dimensions.get('window').height * .03,
        marginHorizontal: Dimensions.get('window').width * .1,
        marginBottom: Dimensions.get('window').height * .03,
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
    subText: {
        marginBottom: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandMedium',
        fontSize: Dimensions.get('window').height * .015,
        color: "rgba(255,255,255,0.7)"
    },
      headerTab: {
        marginTop: Dimensions.get('window').height * .03,
        backgroundColor: Color.LIGHT_BORDER,
        width: Dimensions.get('window').width * .9,
        marginHorizontal: Dimensions.get('window').width * .05,
        borderRadius: 100,
        flexDirection: 'row',
      },
      tab: {
        flex: 1,
        paddingVertical: Dimensions.get('window').height * .02,
        textAlign: 'center',
        borderRadius: 25,
        margin: 5
      },
      tabText: {
        textAlign: 'center',
        color: Color.WHITE,
        fontFamily: 'QuicksandSemiBold'
      },
      notTabText: {
        textAlign: 'center',
        color: Color.MAIN,
        fontFamily: 'QuicksandSemiBold'
      },
    backView: {
        marginTop: Dimensions.get('window').height * .02,
        marginLeft: Dimensions.get('window').height * .015,
    },
    icon: {
        fontSize: Dimensions.get('window').height * .035,
        color: Color.WHITE
    },
    trophies: {
        flex: 1,
        fontSize: Dimensions.get('window').height * .03,
    },
    bronze: {
        color: "#6A3805"
    },
    silver: {
        color: "#B4B4B4"
    },
    gold: {
        color: "#C9B037"
    },
    trophyContainer: {
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').height * .035,
        paddingHorizontal: Dimensions.get('window').width * .04,
        backgroundColor: Color.WHITE,
        borderRadius: 5,
        width: Dimensions.get('window').width * .9,
        marginHorizontal:  Dimensions.get('window').width * .05,
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
    trophyText: {
        flex: 4,
        fontSize: Dimensions.get('window').height * .018,
        fontFamily: 'QuicksandSemiBold',
        color: Color.MAIN,
        textAlign: 'center'
    },
    score: {
        flex: 1,
        fontSize: Dimensions.get('window').height * .025,
        fontFamily: 'QuicksandSemiBold',
        color: Color.MAIN,
        textAlign: 'center',
    },
    howContainer: {
        marginTop: Dimensions.get('window').height * .02,
        paddingVertical: Dimensions.get('window').height * .035,
        paddingHorizontal: Dimensions.get('window').width * .03,
        backgroundColor: Color.WHITE,
        borderRadius: 5,
        width: Dimensions.get('window').width * .9,
        marginHorizontal:  Dimensions.get('window').width * .05,
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
    howHeader: {
        marginBottom: Dimensions.get('window').height * .02,
        fontSize: Dimensions.get('window').height * .02,
        fontFamily: 'QuicksandBold',
        color: Color.MAIN,
    },
    howText: {
        marginHorizontal: Dimensions.get('window').width * .05,
        lineHeight: Dimensions.get('window').height * .024,
        fontSize: Dimensions.get('window').height * .014,
        fontFamily: 'QuicksandMedium',
        color: Color.TEXT,
        opacity: .7
    },
    bold: {
        fontFamily: 'QuicksandBold'
    },
    image: {
        marginTop: Dimensions.get('window').height * .04,
        width: Dimensions.get('window').width * .6,
        height: Dimensions.get('window').width * .6,
        borderRadius: 5,
    },
    leaderContainer: {
        flexDirection: 'row',
        paddingTop: Dimensions.get('window').height * .02,
        paddingBottom: Dimensions.get('window').height * .02,
        paddingHorizontal: Dimensions.get('window').width * .02,
        marginHorizontal: Dimensions.get('window').width * .05,
        marginTop: Dimensions.get('window').height * .01,
        borderRadius: 10,
        backgroundColor: Color.WHITE,
        shadowColor: Color.BLACK,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    rank: {
        textAlign:'center',
        fontSize: Dimensions.get('window').height * .02,
        marginBottom: Dimensions.get('window').width * .01,
        fontFamily: 'QuicksandSemiBold',
        color: Color.MAIN,
        flex: 1
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: Dimensions.get('window').width * .08,
        height: Dimensions.get('window').width * .08,
        borderRadius: 1000,
    },
    leaderTextContainer: {
        marginTop: Dimensions.get('window').height * .005,
        flex: 3,
        paddingHorizontal: Dimensions.get('window').height * .01,
    },
    name: {
        fontSize: Dimensions.get('window').height * .018,
        marginBottom: Dimensions.get('window').width * .01,
        fontFamily: 'QuicksandSemiBold',
        color: Color.HEADER
    },
    chevronContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    score2: {
        fontSize: Dimensions.get('window').height * .02,
        color: Color.MAIN,
        fontFamily: 'QuicksandSemiBold',
    },
});

export default RewardsModalComponent;