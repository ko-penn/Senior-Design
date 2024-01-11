import 'react-native-gesture-handler';
import React from 'react';
import { Text } from 'react-native';
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
import * as Location from 'expo-location';

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

  const [location, setLocation] = useState({})
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [dist, setDist] = useState(null);

  /*const lat1 = parseFloat(JSON.stringify(location.coords.latitude)); const lon1 = parseFloat(JSON.stringify(location.coords.longitude)); setDist(Math.acos(Math.sin(lat1*0.0174533)*Math.sin(39.134754*0.0174533)+Math.cos(lat1*0.0174533)*Math.cos(39.134754*0.0174533)*Math.cos((-84.514904*0.0174533)-(lon1*0.0174533)))*6371*0.621371); */
  /*https://www.youtube.com/watch?v=2q-wgobQ-zQ*/
  useEffect(() => {
    (async() => {
      let {status} = await Location.requestForegroundPermissionsAsync()
      if (status == 'granted'){
        console.log('grant')
      } else {
        console.log('deny')
      }
      loc = await Location.getCurrentPositionAsync()
      console.log(loc)
      setLocation(loc)
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude)
      setDist(Math.acos(Math.sin(latitude*0.0174533)*Math.sin(39.134754*0.0174533)+Math.cos(latitude*0.0174533)*Math.cos(39.134754*0.0174533)*Math.cos((-84.514904*0.0174533)-(longitude*0.0174533)))*6371*0.621371);
    })();
  }, []);

  
  if(data==="login"){
    return (
      <>
        <Text></Text>
        <Text>{((Math.acos(Math.sin(latitude*0.0174533)*Math.sin(39.134754*0.0174533)+Math.cos(latitude*0.0174533)*Math.cos(39.134754*0.0174533)*Math.cos((-84.514904*0.0174533)-(longitude*0.0174533)))*3963)).toString()}</Text>
        <Text>{JSON.stringify(location)}</Text>
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
        <NavigationContainer name='nav'>
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