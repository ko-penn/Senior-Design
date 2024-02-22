import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Start from './components/Start';
import Create from './components/Create';
import Settings from './components/Settings';
import Profile from './components/Profile';
/*https://reactnavigation.org/docs/drawer-based-navigation
https://reactnavigation.org/docs/drawer-navigator/#installation*/
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Status from './components/Status';
import { Account } from "./components/Account"
import MyCamera from './components/MyCamera';

function HomeScreen({ navigation }) {
  return (
    <Start></Start>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <Profile></Profile>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <Settings></Settings>
  );
}

function SettingsCamera({ navigation }) {
  return (
    <MyCamera></MyCamera>
  );
}

export default function App() {
  const Drawer = createDrawerNavigator();
  const [data, setData] = useState('login');

  const childToParent = (childdata) => {
    setData(childdata);
  }
  
  if(data==="login"){
    return (
      <>
        <Account>
          <Status />
          <Login 
            childToParent={childToParent} 
            ver=''>
          </Login>
        </Account>
      </>
      
    );
  }
  else if (data==="loginVerif"){
    return (
      <>
        <Account>
          <Status />
          <Login 
            childToParent={childToParent} 
            ver='Email verification sent. Please verify before logging in.'>
          </Login>
        </Account>
      </>
      
    );
  }
  else if(data==="accountpress"){
    return(
      <>
        <Create childToParent={childToParent}></Create>
      </>
    )
  }
  else if(data==="start"){
    return (
      <>
      <Account>
        <NavigationContainer name='nav'>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen}/>
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
            <Drawer.Screen name="Settings" component={SettingsScreen}/>
            <Drawer.Screen name="MyCamera" component={SettingsCamera}/>
          </Drawer.Navigator>
        </NavigationContainer>
        <Status /></Account>
      </>
    );
  }
  else{
    return (
      <>
        <Text>Problemo</Text>
      </>
    );
  } 
}
