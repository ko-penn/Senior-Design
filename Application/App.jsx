import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Start from './components/Start';
import Create from './components/Create';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigationContainerRef, } from '@react-navigation/native';
import Status from './components/Status';
import { Account, AccountContext } from "./components/Account"
import MyCamera from './components/MyCamera';

function HomeScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Start></Start>
    </KeyboardAvoidingView>
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

function Logout({ childToParent }) {
  useContext(AccountContext).logout();
  useEffect(() => {
    childToParent("login");
  }, []);
  return(null);
  /*return (
    <div style={styles.container}>
      <Text style={styles.logoutText}>Logging you out. Please wait.</Text>
    </div>
  );*/
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
            <Drawer.Screen name="Logout" component={() => <Logout childToParent={childToParent}/>}/>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  }
});
