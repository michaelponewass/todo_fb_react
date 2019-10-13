import {Dimensions, Platform, ScrollView, ShadowPropTypesIOS, StyleSheet, View} from 'react-native';
import {Card, colors, Header, Overlay, Text, ThemeProvider} from 'react-native-elements';
import React, {useEffect, useState} from 'react';
import SwitchSelector from "react-native-switch-selector";
import {addEnumber, getCurrentUser, getEnumbers} from './actions/Feelings';
import {getUsers} from './actions/Users';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "victory-native";
import {useNavigation} from 'react-navigation-hooks';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import FirebaseLogin from "./FirebaseLogin";
import {Firebase} from "./lib/firebase";
import {createStore, useStore} from 'react-hookstore';
import { Rating, AirbnbRating } from 'react-native-elements';
import { FloatingAction } from "react-native-floating-action";
import UserAddOverlay from "./screens/UserAddOverlayScreen";

createStore('userStore', null);
createStore('globalUsersStore', null);


const theme = {
    colors: {
        ...Platform.select({
            android: colors.platform.android,
            ios: colors.platform.ios
        }),
    },
};
/**
 * mew reload
 * https://github.com/venits/react-native-firebase-login-screen
 *
 * @returns {*}
 * @constructor
 */
const LoginScreen = () => {
    const {navigate} = useNavigation();
    const [ globalUser, setGlobalUser ] = useStore('userStore');

    console.log("LoginScreen is called....");

    return (
        <FirebaseLogin login={user => {
            console.log(user);
            setGlobalUser(user.user);
            navigate('Home');
        }}/>
    );

}


const SwitchSelectorScreen = () => {
    const options = [
        /*

                { label: "Oh Schreck!", value: "1" },
                { label: "Schlecht", value: "2" },
                { label: "Naja", value: "3" },
                { label: "Ok", value: "4" },
                { label: "Gut", value: "5" },
                { label: "Hmm..", value: "6" },
                { label: "Sehr gut", value: "7" },
                { label: "Wow", value: "8" },
                { label: "Großartig", value: "9" },
                { label: "Unglaublich", value: "10" },
        */
        { label: "Schlecht", value: "1" },
        { label: "Ok", value: "2" },
        { label: "Hmm..", value: "3" },
        { label: "Sehr gut", value: "4" },
        { label: "Wow", value: "5" },
        { label: "Unglaublich", value: "6" },
/*

 reviews={["Bad", "OK", "Hmm...", "Very Good", "Wow", "Amazing"]}
*/

    ];

    const OwnCardTitle = () => {
        if ((!globalUser) || globalUser.isAnonymous) {
            return (
                <Text>ICH</Text>
            );
        } else {
            return (
                <Text style={{textAlign:'center'}}>{globalUser.email.toUpperCase()}</Text>
            );
        }
    };
    evaluateTickFormat = () => {
        return dateasdate => dateasdate.toLocaleString('de-de', {
            day: '2-digit',
            month: 'short'
        })
    };

    const [feels, setFeels] = useState([])
    // Set an initilizing state whilst Firebase connects
    const [initilizing, setInitilizing] = useState(true);
    const [ globalUser, setGlobalUser ] = useStore('userStore');
    const [ globalUsers, setGlobalUsers ] = useStore('globalUsersStore');


    // Handle user state changes
    function onAuthStateChanged(user) {
        // happen, if i delete a user on firebase console
        if (user==null) {
            return;
        }
        setGlobalUser(user);
        getEnumbersFromFirebase();
        if (initilizing) setInitilizing(false);
        console.log("user is set onAuthStateChanged. user: "+user.uid);
    }

    handleEmotionUpdate = (value) => {
        if (!globalUser) {
            return;
        }
        let currentDate = Date.now();
        let feel = {feel: value, date: currentDate}
        setFeels(getConvData([...feels, feel]))
        addEnumber([...feels, feel], globalUser.uid);
        console.log("handleff EmotionUpdate: Number: " + value + " Date: " + currentDate);
    }

    function findMinMax(arr) {
        let min = arr[0].dateasdate, max = arr[0].dateasdate;

        for (let i = 1, len=arr.length; i < len; i++) {
            let v = arr[i].dateasdate;
            min = (v < min) ? v : min;
            max = (v > max) ? v : max;
        }

        return [min, max];
    }
    function getConvData(data) {
        return data.map((feel, index, array) => {
            return {...feel, feelint: parseInt(feel.feel), dateasdate: new Date(feel.date)}
        });
    }

    async function loginAnonymouse() {
        try {
            if (Firebase === null) return () => new Promise(resolve => resolve());
            console.log("loginAnonymouse wird aufgerufen");
            await Firebase.auth().signInAnonymously();
        } catch (e) {
            switch (e.code) {
                case 'auth/operation-not-allowed':
                    console.log('Enable anonymous in your firebase console.');
                    break;
                default:
                    console.error(e);
                    break;
            }
        }
    }

    function getEnumbersFromFirebase() {
        if (!globalUser) {
            return;
        }
         getUsers().then((userdata) => {
              //  if (userdata.length > 0) {
                    setGlobalUsers(userdata);
                    console.log("setGlobalUsers done:: " + JSON.stringify(userdata));
              //  }
            }
        );

        console.log("call getEnumbersFromFirebase..." + globalUser.uid);
        getEnumbers(globalUser.uid).then((data) => {
            if (data.length > 0) {
                const convData = getConvData(data);
                setFeels(convData);
                //@todo: Ermitteln min und max und Datum der X Axe setzen.
                //console.log("min u. Max Values: " + JSON.stringify(findMinMax(feels)));
                //console.log("data ist: " + JSON.stringify(convData));
            }
        });
    }
//

    useEffect(() => {
        const subscriber = Firebase.auth().onAuthStateChanged(onAuthStateChanged);
        if (initilizing) {
            return;
        }
        if (!globalUser) {
            loginAnonymouse();
        } else{
            getEnumbersFromFirebase();
        }
        return () => {
            setInitilizing(false);
            subscriber();
        }

    }, [globalUser]);


    const floatingActions = [
        {
            text: "Benutzer hinzufügen",
            name: "bt_add_user",
            position: 1
        }
    ];


    const {navigate} = useNavigation();
    const windowSize = Dimensions.get("window");
    const [zoom, setZoom] = useState({});
    const [brush, setBrush] = useState(0);
    return (

        <ThemeProvider theme={theme}>
            <Header
                centerComponent={{text: 'Emotionale Nummer', style: {color: '#fff'}}}
                rightComponent={{
                    icon: 'add', color: '#fff', onPress: () => {
                        navigate("Login")
                    }
                }}
            />
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                <ScrollView>
                    <Card title={<OwnCardTitle/>} titleStyle={{color: 'red'}} containerStyle={{padding: 10}}>
                        <Text h4 style={{textAlign: 'center', padding: 15}}>Wie geht's Dir?</Text>

                        <AirbnbRating
                            count={6}
                            reviews={["Schlecht", "OK", "Hmm...", "Sehr gut", "Wow", "Unglaublich"]}
                            defaultRating={3}
                            size={40}
                            onFinishRating={value => handleEmotionUpdate(value)}
                        />

                        {/*
                        <SwitchSelector
                            options={options}
                            initial={2}
                            bold={true}
                            onPress={value => handleEmotionUpdate(value)}
                        />
                         */}

                        <VictoryChart theme={VictoryTheme.material} scale={{x: 'time'}}
                                      width={windowSize.width}
                                      tickCount={4}>

                            <VictoryAxis dependentAxis
                                         domain={[0, 6]}
                                         offsetX={30}
                                         orientation="left"
                                         standalone={false}/>

                            <VictoryAxis
                                scale="time"
                                standalone={false}
                                tickFormat={evaluateTickFormat()}
                            />

                            {/*
                        tickFormat={dateasdate => dateasdate.toLocaleString('de-de', { month: 'short' })}
                               containerComponent={

                        tickFormat={dateasdate => dateasdate.toLocaleString('de-de', { month: 'short' })}

                    <VictoryZoomContainer responsive={true}
                                          zoomDimension="x"
                                          zoomDomain={zoom}
                                          onZoomDomainChange={zoom}
                    />

                }>*/}

                            <VictoryScatter
                                style={{data: {fill: 'green'}}}
                                size={7}
                                data={feels} x="dateasdate" y="feelint"
                            />
                            <VictoryLine sortKey={2} data={feels} x="dateasdate" y="feelint"/>


                            {/*
                    <VictoryBar sortKey={2}  data={feels} x="dateasdate" y="feelint" />

                    */}

                        </VictoryChart>
                    </Card>
                </ScrollView>
            </View>

            <FloatingAction
                actions={floatingActions
                }
                position="right"
                onPressItem={name => {
                    console.log("onPressItem was pressend: "+name);
                    navigate('AddUser');
                }}
            />
        </ThemeProvider>
    );
};


const AppNavigator = createSwitchNavigator(
    {
        Home: SwitchSelectorScreen,
        Login: LoginScreen,
        AddUser: UserAddOverlay
    },
    {
        initialRouteName: "Home"
    }
);

export default createAppContainer(AppNavigator);

