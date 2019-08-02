import {Dimensions, Platform, ScrollView, ShadowPropTypesIOS, StyleSheet, Text, View} from 'react-native';
import {Card, colors, Header, ThemeProvider} from 'react-native-elements';
import React, {useEffect, useState} from 'react';
import SwitchSelector from "react-native-switch-selector";
import {addEnumber, getEnumbers} from './actions/Feelings';
import {VictoryChart, VictoryLine, VictoryScatter, VictoryTheme} from "victory-native";
import TodoScreen from './screens/TodoScreen';
import {createBottomTabNavigator} from 'react-navigation';

const theme = {
    colors: {
        ...Platform.select({
            default: colors.platform.android,
            ios: colors.platform.ios,
        }),
    },
};


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

        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
/*
        { label: "7", value: "7" },
        { label: "8", value: "8" },
        { label: "9", value: "9" },
        { label: "10", value: "10" },
*/
    ];
    const [switchValue, setSwitchValue] = useState(0)
    const [feels, setFeels] = useState([])



    handleEmotionUpdate = (value) => {
        setSwitchValue(value);
        let currentDate = Date.now();
        let feel={feel : value, date : currentDate}
        setFeels(getConvData([...feels, feel]))
        addEnumber([...feels, feel]);
        console.log("handleff EmotionUpdate: Number: " + value + " Date: "+currentDate);
    }
    function getConvData(data) {
        return data.map((feel, index, array) => {
            return {...feel, feelint: parseInt(feel.feel), dateasdate: new Date(feel.date)}
        });
    }

    useEffect(() => {
        getEnumbers().then((data) => {
            if (data.length > 0) {
                const convData = getConvData(data);
                setFeels(convData);
                console.log("data ist: " + JSON.stringify(convData));
            }
        });
    }, []);
    const windowSize = Dimensions.get("window");
    const [zoom, setZoom] = useState({});
    const [brush, setBrush] = useState(0);

    return (
        <ThemeProvider theme={theme}>
            <Header
                centerComponent={{ text: 'Emotionale Nummer', style: { color: '#fff' } }}
                rightComponent={{ icon: 'add', color: '#fff' }}
            />
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                <ScrollView>
                <Card title='Michael'>
                    <Text h1>Wie ist Deine Stimmung als Zahl ausgedrückt?</Text>
                        <SwitchSelector
                            options={options}
                            initial={0}
                            onPress={value => handleEmotionUpdate(value)}
                        />

                <VictoryChart  theme={VictoryTheme.material}  style={{ parent: { maxWidth: "100%" } }} scale={{x: 'time'}}
                               width={windowSize.width}
                               domainPadding={{x: 10, y: 25}}
                               tickCount={4}>
                    {/*
                               containerComponent={


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
                    <VictoryLine sortKey={2}  data={feels} x="dateasdate" y="feelint" />


                    {/*
                    <VictoryBar sortKey={2}  data={feels} x="dateasdate" y="feelint" />

                    */}

                </VictoryChart>
                </Card>
                </ScrollView>
            </View>
        </ThemeProvider>
    );
}


const TabNavigator = createBottomTabNavigator({
    Home: TodoScreen,
    Switch: SwitchSelectorScreen,
});

//export default createAppContainer(TabNavigator);

export default SwitchSelectorScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    textInput: {
        height: 20,
        flex: 1,
        minHeight: '7%',
        marginTop: '5%',
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 10
    },
    taskWrapper: {
        marginTop: '5%',
        flexDirection: 'row',
        // alignItems: 'baseline',
        borderColor: '#D0D0D0',
        borderBottomWidth: 0.5,
        width: '100%',
        alignItems: 'stretch',
        minHeight: 40,
    },
    task: {
        paddingBottom: 20,
        paddingLeft: 10,
        paddingTop: 6,
        borderColor: 'black',
        borderBottomWidth: 1,
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        borderColor: 'rgb(222,222,222)',
        borderBottomWidth: 1,
        paddingRight: 10,
        paddingBottom: 5
    }
});
