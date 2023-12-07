import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import Login from './components/Login';
import Start from './components/Start';
import Create from './components/Create';
import Hamburger from './components/Hamburger';
import Settings from './components/Settings';
import Profile from './components/Profile';



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
        <Hamburger></Hamburger>
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
  else if(data==="settings"){
    return(
      <>
        <Settings></Settings>
        <StatusBar style="auto" />
      </>
    )
  }
  else if(data==="profile"){
    return(
      <>
        <Profile></Profile>
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