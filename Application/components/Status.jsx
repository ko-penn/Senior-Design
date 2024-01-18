import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./Account";
import { StyleSheet, Text, View, TextInput,TouchableOpacity, Button } from 'react-native';


const Status = () => {
    const [status, setStatus] = useState(false);

    const { getSession, logout } = useContext(AccountContext);

    useEffect (() => {
        getSession()
            .then(session => {
                console.debug("Session: ", session);
                setStatus(true);
            })
    }, [])

    return <View>{status ?  <TouchableOpacity onPress={logout} style={styles.loginButton} accessibilityLabel="Logging you in"><Text style={styles.loginText}>Logout</Text></TouchableOpacity> : <Text>Please login</Text>}</View>
};


export default Status; 