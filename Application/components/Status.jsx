import React, { useState, useContext, useEffect } from "react";
import { AccountContext } from "./Account";
import { StyleSheet, Text, View, TextInput,TouchableOpacity, Button } from 'react-native';


const Status = () => {
    const [status, setStatus] = useState(false);

    const { getSession, logout } = useContext(AccountContext);

    useEffect (() => {
        getSession()
            .then(session => {
                console.log('Session', session);
                console.debug("Session: ", session);
                setStatus(true);
            })
    }, [])

    // return <View>{status ?  <TouchableOpacity onPress={logout} style={styles.logout} accessibilityLabel="Logging you out">
    //   <Text style={styles.logoutText}>Logout</Text></TouchableOpacity> : <Text>Please login</Text>}</View>
    return <View>{!status ? <Text>Please login</Text> : <View></View>}</View>
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      margin: 10,
      width: 300,
      borderWidth: 1,
      borderRadius:10,
      padding: 5,
    },
    createtext: {
      textDecorationLine: 'underline',
    },
    logoutText: {
      color:'#fff',
      textAlign: 'center',
      fontWeight: '700',
      fontSize: 16
    },
    logout: {
      backgroundColor:'#841584', 
      padding:10, 
      borderRadius:20,
      marginBottom:30,
      width:300,
      paddingTop: 100
    }
  });

export default Status; 