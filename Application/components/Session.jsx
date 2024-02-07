/*Page to display your active game, contains image/description, distance, direction, and button to win*/
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect} from 'react';
import * as Location from 'expo-location';


//https://stackoverflow.com/questions/3932502/calculate-angle-between-two-latitude-longitude-points
function angleFromCoordinates(lat1,long1,lat2,long2) {
  let y = Math.sin((long2-long1))*Math.cos(lat2);
  let x = Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos((long2-long1));
  let brng = Math.atan2(y, x);
  brng = brng*57.2958;
  brng = (brng + 360) % 360; //count degrees clockwise
  return(brng);
}


export default function Session() {
  const [targetDist, setTargetDist] = useState(null);
  const [targetAngle, setTargetAngle] = useState(null);
  const [targetDirection, setTargetDirection] = useState(null);
  const [lat2, setLat2] = useState(39.134754);
  const [long2, setLong2] = useState(-84.514904);
  const direction = (deg) => {
    if(deg>315 && deg<=45){setTargetDirection("North")}
    else if(deg>45 && deg<=135){setTargetDirection("East")}
    else if(deg>135 && deg<=225){setTargetDirection("South")}
    else if(deg>225 && deg<=315){setTargetDirection("West")}
  }

 /*https://www.youtube.com/watch?v=2q-wgobQ-zQ*/
 useEffect(() => {
  (async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted'){
      console.log('deny')
      return;
    } else {
      console.log('granted')
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    setTargetDist((Math.acos(Math.sin(currentLocation.coords.latitude*0.0174533)*Math.sin(lat2*0.0174533)+Math.cos(currentLocation.coords.latitude*0.0174533)*Math.cos(lat2*0.0174533)*Math.cos((long2*0.0174533)-(currentLocation.coords.longitude*0.0174533)))*3963));
    setTargetAngle(angleFromCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude, lat2, long2));
  })();
}, []);

  //look for a better solution than this
  setTimeout(function(){
    direction(targetAngle);
  }, 5000);
  
  return (
    <>
      <View style={styles.container}>
        <Text>Target: {'description or picture of target'}</Text>
        <Text>Target is {targetDist} miles to the {targetDirection}</Text>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});