import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import Login from './components/Login';
import Start from './components/Start';
import Create from './components/Create';
import Settings from './components/Settings';
import Profile from './components/Profile';
/*https://reactnavigation.org/docs/drawer-based-navigation
https://reactnavigation.org/docs/drawer-navigator/#installation*/
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

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

export default function App() {
  const Drawer = createDrawerNavigator();
  const [data, setData] = useState('login');
  
  const childToParent = (childdata) => {
    setData(childdata);
  }

  if(data==="login"){
    return (
      <>
        <Login childToParent={childToParent}></Login>
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
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen}/>
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
            <Drawer.Screen name="Settings" component={SettingsScreen}/>
          </Drawer.Navigator>
        </NavigationContainer>
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