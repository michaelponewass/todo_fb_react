import { Button, ThemeProvider } from 'react-native-elements';
import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ShadowPropTypesIOS,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Task from './Task'
import { getMeals, addTodo } from './actions/Todos';


import {FirebaseRef} from "./lib/firebase";
const App = () => {

    const [value, setValue] = useState('')
    const [todos, setTodos] = useState([])

    handleAddTodo = () => {
        let task={text: value, key: Date.now(), checked: false};
        if (value.length > 0) {
            setTodos([...todos, task])
            setValue('')
        }
        addTodo(task).then((success) => {
            console.log("success added: "+ JSON.stringify(success));
        });

/*

        getMeals().then((data) => {
        console.log("Meals: "+JSON.stringify(data))
    })
*/

    }

    handleDeleteTodo = (id) => {
        setTodos(
            todos.filter((todo) => {
                if (todo.key !== id) return true
            })
        )
    }

    handleChecked = (id) => {
        setTodos(
            todos.map((todo) => {
                if (todo.key === id) todo.checked = !todo.checked;
                return todo;
            })
        )
    }
    return (
        <ThemeProvider>
            <View style={styles.container}>
                <Text style={{marginTop: '10%', fontSize: 16, color: 'black'}}>Today</Text>
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
    )
}
export default App
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
