import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import Login from './components/Login';
import Start from './components/Start';
import Create from './components/Create';

export default function App() {
  const [data, setData] = useState('login');
  
  const childToParent = (childdata) => {
    setData(childdata);
  }

  if(data==="login"){
    return (
      <>
        <Login childToParent={childToParent}></Login>
        <StatusBar style="auto" />
      </>
      
    );
  }
  else if(data==="start"){
    return (
      <>
        <Start childToParent={childToParent}></Start>
        <StatusBar style="auto" />
      </>
    );
  }
  else if(data==="accountpress"){
    return(
      <>
        <Create childToParent={childToParent}></Create>
        <StatusBar style="auto" />
      </>
    )
  }
  else{
    return (
      <>
        <Text>Problemo</Text>
        <StatusBar style="auto" />
      </>
    );
  } 
}