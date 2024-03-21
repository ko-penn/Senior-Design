import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Start from './components/Start';
import Create from './components/Create';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Status from './components/Status';
import { Account, AccountContext } from "./components/Account";
import SettingsCamera from './components/SettingsCamera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogBox } from 'react-native';

function Wrapper({ data }){
  return (
    $(data).wrap("<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}></KeyboardAvoidingView>")
  );
}

function HomeScreen({ navigation }) {
  return (
    <Start>
      <Wrapper data="Start"></Wrapper>
    </Start>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <Profile>
      <Wrapper data="Profile"></Wrapper>
    </Profile>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <Settings>
      <Wrapper data="Settings"></Wrapper>
    </Settings>
  );
}

function SettingsCameraScreen({ navigation }) {
  return (
    <SettingsCamera>
      <Wrapper data="SettingsCamera"></Wrapper>
    </SettingsCamera>
  );
}

function Logout({ childToParent }) {
  useContext(AccountContext).logout();
  useEffect(() => {
    childToParent("login");
  }, []);
  return(null);
}

export default function App() {
  const Tab = createBottomTabNavigator();
  const [data, setData] = useState('login');
  LogBox.ignoreAllLogs(); //Disables popup warnings on device

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
            <Wrapper data="Login"></Wrapper>
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
            <Wrapper data="Login"></Wrapper>
          </Login>
        </Account>
      </>
      
    );
  }
  else if(data==="accountpress"){
    return(
      <>
        <Create childToParent={childToParent}>
          <Wrapper data="Create"></Wrapper>
        </Create>
      </>
    )
  }
  else if(data==="start"){
    return (
      <>
      <Account>
        <NavigationContainer name='nav'>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = 'home-outline';
                } 
                else if (route.name === 'Profile') {
                  iconName = 'person-circle-outline';
                }
                else if (route.name === 'Settings') {
                  iconName = 'settings-outline';
                }
                else if (route.name === 'Camera') {
                  iconName = 'camera-outline';
                }
                else if (route.name === 'Logout') {
                  iconName = 'exit-outline';
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#31a9ce',
              tabBarInactiveTintColor: 'gray',
          })}>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
            <Tab.Screen name="Settings" component={SettingsScreen}/>
            <Tab.Screen name="Camera" component={SettingsCameraScreen}/>
            <Tab.Screen name="Logout" component={() => <Logout childToParent={childToParent}/>}/>
          </Tab.Navigator>
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
