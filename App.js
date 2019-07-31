import {Header, ThemeProvider} from 'react-native-elements';
import React, {useEffect, useState} from 'react';
import {ScrollView, ShadowPropTypesIOS, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";
import Task from './Task'
import {addTodo, getTodos, addEnumber, getEnumbers} from './actions/Todos';
import {VictoryLine, VictoryBar, VictoryScatter, VictoryChart, VictoryTheme, VictoryZoomContainer} from "victory-native";


import {createAppContainer, createBottomTabNavigator} from 'react-navigation';



const SwitchSelectorScreen = () => {
    const options = [

        { label: "1", value: "Oh Schreck!" },
        { label: "2", value: "Schlecht" },
        { label: "3", value: "Naja" },
        { label: "4", value: "Ok" },
        { label: "5", value: "Gut" },
        { label: "6", value: "Hmm.." },
        { label: "7", value: "Sehr gut" },
        { label: "8", value: "Wow" },
        { label: "9", value: "Großartig" },
        { label: "10", value: "Unglaublich" },

/*
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
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
    const windowSize = Dimension.get("window");
    const [zoom, setZoom] = useState({});
    const [brush, setBrush] = useState(0);

    return (
        <ThemeProvider>
            <Header
                leftComponent={{ icon: 'menu', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'home', color: '#fff' }}
            />

            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>

                <Text h2>Wie geht's Dir?</Text>

                <SwitchSelector
                    options={options}
                    initial={0}
                    onPress={value => handleEmotionUpdate(value)}
                />


                <VictoryChart  theme={VictoryTheme.material}  style={{ parent: { maxWidth: "100%" } }} scale={{x: 'time'}}
                               width={windowSize.width}
                               domainPadding={{x: 10, y: 25}}
                               tickCount={4}
                               containerComponent={
                    <VictoryZoomContainer responsive={true}
                                          zoomDimension="x"
                                          zoomDomain={zoom}
                                          onZoomDomainChange={zoom}
                    />
                }>
                    {/*
                    <VictoryScatter
                        style={{data: {fill: 'green'}}}
                        size={7}
                        data={feels} x="dateasdate" y="feelint"
                    />
                                        <VictoryLine sortKey={2}  data={feels} x="dateasdate" y="feelint" />

                    */}
                    <VictoryBar sortKey={2}  data={feels} x="dateasdate" y="feelint" />

                </VictoryChart>

            </View>
        </ThemeProvider>
    );
}

const TodoScreen = () => {

    const [value, setValue] = useState('')
    const [todos, setTodos] = useState([])

    useEffect(() => {
        getTodos().then((data) => {
            if (data.length > 0) {
                setTodos(data);
                //console.log("data ist: " + JSON.stringify(data));
            }
        });
    }, []);

    updateTodos = (data) => {
        addTodo(data).then((success) => {
            //console.log("success added a new one: " + JSON.stringify(data));
        });
    }

    handleAddTodo = () => {
        console.log("handle addToDo fired... Data: " + value);
        let task = {text: value, key: Date.now(), checked: false};
        if (value.length > 0) {
            setTodos([...todos, task])
            setValue('')
            updateTodos([...todos, task]);
        }
    }
    handleDeleteTodo = (id) => {
        const filteredData = todos.filter((todo) => {
            if (todo.key !== id) return true
        })
        setTodos(filteredData)
        updateTodos(filteredData);
    }
    handleChecked = (id) => {
        const filteredData =
            todos.map((todo) => {
                if (todo.key === id) todo.checked = !todo.checked;
                return todo;
            })
        setTodos(filteredData)
        updateTodos(filteredData);
    };
    return (
        <ThemeProvider>
            <View style={styles.container}>
                <Text style={{marginTop: '10%', fontSize: 16, color: 'black'}}>Heute</Text>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.textInput}
                        multiline={true}
                        onChangeText={(value) => setValue(value)}
                        placeholder={'Do it now!'}
                        placeholderTextColor="black"
                        value={value}
                    />
                    <TouchableOpacity onPress={() => handleAddTodo()}>
                        <Icon name="plus" size={30} color="#900" style={{marginLeft: 15}}/>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {
                        todos.map((task) => (
                            <Task
                                text={task.text}
                                key={task.key}
                                checked={task.checked}
                                setChecked={() => handleChecked(task.key)}
                                delete={() => handleDeleteTodo(task.key)}
                            />
                        ))

                    }
                </ScrollView>
            </View>
        </ThemeProvider>
    );
}

const TabNavigator = createBottomTabNavigator({
    Home: TodoScreen,
    Switch: SwitchSelectorScreen,
});

export default createAppContainer(TabNavigator);

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
