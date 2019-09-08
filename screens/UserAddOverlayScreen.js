import {Button, Overlay, Text, ThemeProvider} from "react-native-elements";
import React, {useEffect, useState} from 'react';
import {View} from "react-native";
import {useNavigation} from 'react-navigation-hooks';

const UserAddOverlay = () => {
    const [visible, setVisible] = useState(true);
    const {navigate} = useNavigation();

    useEffect(() => {
        if (!visible) {
            navigate("Home");
            }
        });

    return (
        <Overlay isVisible={visible}
                 onBackdropPress={() => setVisible(false)}>
            <Text>Hello from Overlay!</Text>
            <Button
                title="Schliessen"
                onPress={() => {
                    setVisible(false);
                }}
            />


        </Overlay>

);

};
export default UserAddOverlay;
