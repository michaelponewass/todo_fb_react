import {List, Button, ListItem, Overlay, Text, ThemeProvider} from "react-native-elements";
import React, {useEffect, useState} from 'react';
import {useNavigation} from 'react-navigation-hooks';
import {useStore} from 'react-hookstore';

const UserAddOverlay = () => {
    const [visible, setVisible] = useState(true);
    const [ globalUsers] = useStore('globalUsersStore');
    const {navigate} = useNavigation();

    useEffect(() => {
        if (!visible) {
            navigate("Home");
        }
    });

    const list = [
        {
            name: 'Amy Farha',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            subtitle: 'Vice President'
        },
        {
            name: 'Chris Jackson',
            avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
            subtitle: 'Vice Chairman'
        },
    ];

    let userList = Object.entries(globalUsers);

    /**
     *
     * @param userId
     */
    function addCardToMainScreen(userId) {
        console.log("user id ist: ".userId);

    }

    return (
        <Overlay isVisible={visible}
                 onBackdropPress={() => setVisible(false)}>
            <Text>Hello from Overlay!</Text>
            {
                userList.map(item => (
                    <ListItem
                        key={item[0]}
                        title={item[1].name}
                        onPress={() => {
                           console.log("userId: "+item[0]);
                        }}
                        bottomDivider
                    />
                ))
            }
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
