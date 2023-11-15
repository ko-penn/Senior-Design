import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import Login from './components/Login';

export default function App() {
  const [data, setData] = useState('login');
  
  const childToParent = (childdata) => {
    setData(childdata);
  }

  if(data==="login"){
    return (
      <View style={styles.container}>
        <Login childToParent={childToParent}></Login>
        <StatusBar style="auto" />
      </View>
    );
  }
  else if(data==="loginpress"){
    return (
      <View style={styles.container}>
        <p>welcome</p>
        <StatusBar style="auto" />
      </View>
    );
  }
  else if(data==="accountpress"){
    return(
      <View style={styles.container}>
        <Text>welcome</Text>
        <StatusBar style="auto" />
      </View>
    )
  }
  else{
    return (
      <View style={styles.container}>
        <Text>Problemo</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});