/*Page to display your active game, contains image/description, distance, direction, and button to win*/
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import { Magnetometer} from 'expo-sensors';
import { useState, useEffect} from 'react';
import * as Location from 'expo-location';

//https://stackoverflow.com/questions/3932502/calculate-angle-between-two-latitude-longitude-points
function angleFromCoordinates(lat1,long1,lat2,long2) {
  dLon = (long2 - long1);
  y = Math.sin(dLon)*Math.cos(lat2);
  x = Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
  brng = Math.atan2(y, x);
  brng = brng*57.2958;
  brng = (brng + 360) % 360; //count degrees clockwise
  return(brng);
}



export default function Session() {

  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [targetDist, setTargetDist] = useState(null);
  const [targetAngle, setTargetAngle] = useState(null);
  const [targetDirection, setTargetDirection] = useState(null);
  const direction = (deg) => {
    if(deg>315 && deg<=45){setTargetDirection("North")}
    else if(deg>45 && deg<=135){setTargetDirection("East")}
    else if(deg>135 && deg<=225){setTargetDirection("South")}
    else if(deg>225 && deg<=315){setTargetDirection("West")}
  }

  //Code for recieving other player's data
  //
  //
  //description/picture flag
  d=true;
  //set player description or player picture
  if(d==true){desc='brown eyes, eyes are 2 cm. apart';}
  else{desc=null;}
  //set long2 and lat2
  long2=-84.514904;
  lat2=39.134754;



  /*https://www.youtube.com/watch?v=2q-wgobQ-zQ*/
  useEffect(() => {
    (async() => {
      let {status} = await Location.requestForegroundPermissionsAsync()
      if (status == 'granted'){
        console.log('grant')
      } else {
        console.log('deny')
      }
      loc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest,maximumAge: 10000});
      setTargetDist((Math.acos(Math.sin(loc.coords.latitude*0.0174533)*Math.sin(lat2*0.0174533)+Math.cos(loc.coords.latitude*0.0174533)*Math.cos(lat2*0.0174533)*Math.cos((long2*0.0174533)-(loc.coords.longitude*0.0174533)))*3963));
      setTargetAngle(angleFromCoordinates(loc.coords.latitude, loc.coords.longitude, lat2, long2));
    })();
  }, []);

  //look for a better solution than this
  setTimeout(function(){
    direction(targetAngle);
  }, 2000);
  
  
  Magnetometer.addListener(result => {
    setData(result);
  })
  Magnetometer.setUpdateInterval(1000);

  heading = Math.atan2(y, x)*180/Math.PI - 90;
  if(heading>-45 && heading<=45){myDirection="North"}
  else if(heading>45 || heading<=-225){myDirection="East"}
  else if(heading>-225 && heading<=-135){myDirection="South"}
  else if(heading<=-45 && heading>-135){myDirection="West"}
  else {myDirection=null}

  if(d==true){
    return (
      <>
          <View style={styles.container}>
            <Text>Target: {d}</Text>
            <Text>You are heading {myDirection}</Text>
            <Text>Target is {targetDist} miles to the {targetDirection}</Text>
          </View>
      </>
    );
  }
  else if (d==false){
    return (
      <>
          <View style={styles.container}>
            <Text>Target</Text>
            <Image></Image>
            <Text>Heading {myDirection}</Text>
            <Text>Distance to target: {targetDist} miles</Text>
            <Text>Target is {targetDirection}</Text>
          </View>
      </>
    );
  }
  else{
    return (
      <>
          <View style={styles.container}>
            <Text>Target</Text>
            <Text>No description or picture is available</Text>
            <Text>Heading {myDirection}</Text>
            <Text>Distance to target: {targetDist} miles</Text>
            <Text>Target is {targetDirection}</Text>
          </View>
      </>
    );
  }

  
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});