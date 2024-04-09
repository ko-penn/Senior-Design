/*Page to display your active game, contains image/description, distance, direction, and button to win*/
import React from 'react';
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity } from 'react-native';
import { Magnetometer} from 'expo-sensors';
import { useState, useEffect} from 'react';
import * as Location from 'expo-location';
import { send as sendWebSocket, 
  sendCurrentLocation, 
  getTargetInitialCordinates, 
  targetLat, 
  targetLong, 
  disconnect as disconnectFromWebsocket, 
  waitForSessionUpdates, 
  targetDescription, 
  targetUserName,
  disconnect
} 
from './WebSocketService';
import Start from './Start';
import { getS3Pic } from './s3GetObject';



//https://stackoverflow.com/questions/3932502/calculate-angle-between-two-latitude-longitude-points
function angleFromCoordinates(lat1,long1,lat2,long2) {
  let y = Math.sin((long2-long1))*Math.cos(lat2);
  let x = Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos((long2-long1));
  let brng = Math.atan2(y, x);
  brng = brng*57.2958;
  brng = (brng + 360) % 360; //count degrees clockwise
  return(brng);
}

// example of how to call websocket functions
function testSocket() {
  sendWebSocket("{\"action\": \"sendMessage\", \"message\": \"Hello from app\"}")
}



export default function Session() {
  
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [disconnected, setDisconnected] = useState(false);
  const [targetDist, setTargetDist] = useState(null);
  const [targetAngle, setTargetAngle] = useState(null);
  const [targetDirection, setTargetDirection] = useState(null);
  const [targetPicture, setTargetPicture] = useState(null);
  const [picExist, setPicExist] = useState(false);
  const [lat2, setLat2] = useState(39.134754);
  const [long2, setLong2] = useState(-84.514904);
  const [foundText, setFoundText] = useState('');
  const direction = (deg) => {
    if(deg>315 && deg<=45){setTargetDirection("North")}
    else if(deg>45 && deg<=135){setTargetDirection("East")}
    else if(deg>135 && deg<=225){setTargetDirection("South")}
    else if(deg>225 && deg<=315){setTargetDirection("West")}
  }
  const plat = Platform.OS;
  const onFound = () => {
    console.log("I Found You! button pressed");
    if (targetDist <= 0.0625){
      setFoundText("You have successfully found your target!");
    } else {
      setFoundText("Are you sure you have found your target?");
    }
  };
  var descriptionSection = null;

  const stopMatching = async () => {
    
    disconnect();
    setDisconnected(true);
  }

 /*https://www.youtube.com/watch?v=2q-wgobQ-zQ*/
 useEffect(() => {
  (async () => {
    if (targetDescription === "undefined") {
      const base64image = await getS3Pic(targetUserName);
      setTargetPicture(base64image)
      setPicExist(true);
    }
     

    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted'){
      console.log('deny')
      return;
    } else {
      console.log('granted')
    }

    // takes awhile to get to this part of the code. Maybe ask for user location permission while searching
    let currentLocation = await Location.getCurrentPositionAsync({});
    sendCurrentLocation(currentLocation.coords.latitude, currentLocation.coords.longitude)

    // Takes a few seconds to get the cordinates back. Possibly send cordinates earlier so we have the initial cords ready but 
    // that can only happen if we move the location request earlier in the process
    await getTargetInitialCordinates()
    // Just incase if the disconnection happens before the cordinates are received
    .then((message) => {
      if (message == "Match disconnected") {
        disconnectFromWebsocket();
        setDisconnected(true);
      }
    })

    console.log(targetLat)
    console.log(targetLong)
    setTargetDist((Math.acos(Math.sin(currentLocation.coords.latitude*0.0174533)*Math.sin(targetLat*0.0174533)+Math.cos(currentLocation.coords.latitude*0.0174533)*Math.cos(targetLat*0.0174533)*Math.cos((targetLong*0.0174533)-(currentLocation.coords.longitude*0.0174533)))*3963).toFixed(2));
    setTargetAngle(angleFromCoordinates(currentLocation.coords.latitude, currentLocation.coords.longitude, targetLat, targetLong));   
  })();
}, []);

  //look for a better solution than this
  setTimeout(function(){
    // If person disconnects this will fire 
    // TODO: add logic for updating location as well
    waitForSessionUpdates()
    .then((value) => {
      if (value == "Match disconnected") {
        disconnectFromWebsocket()
        setDisconnected(true);
      }
    })
    direction(targetAngle);
  }, 5000);

  if (disconnected) {
    return <Start />;
  }

  if (picExist === true) {
    descriptionSection = 
    <Image source={{ uri: targetPicture }} style={styles.mysteryMan} />
    ;
  } else {
    descriptionSection = 
    <Text>Target Description: {targetDescription}</Text>
    ;
  }
  
  if (plat === 'ios' || plat === 'android'){
    Magnetometer.addListener(result => {
      setData(result);
    })
    Magnetometer.setUpdateInterval(2000);
  
    heading = Math.atan2(y, x)*180/Math.PI - 90;
    if(heading>-45 && heading<=45){myDirection="North"}
    else if(heading>45 || heading<=-225){myDirection="East"}
    else if(heading>-225 && heading<=-135){myDirection="South"}
    else if(heading<=-45 && heading>-135){myDirection="West"}
    else {myDirection=null}
    return (
      <>
        <View style={styles.container}>
          {descriptionSection}
          <Text>Target is {targetDist} miles to the {targetDirection}</Text>
          <Text>Aiming {myDirection}</Text>
          <Text style={styles.foundText}>{foundText}</Text>
          <TouchableOpacity onPress={onFound} style={styles.foundButton} accessibilityLabel="I Found You!">
            <Text style={styles.foundText}>I Found You!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stopMatching()}
          style={styles.matchmakeButton}
            accessibilityLabel="Cancel"
          >
            <Text style={styles.matchmakeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  else{
    return (
      <>
        <View style={styles.container}>
        {descriptionSection}
          <Text>Target is {targetDist} miles to the {targetDirection}</Text>
          <Text style={styles.foundText}>{foundText}</Text>
          <TouchableOpacity onPress={onFound} style={styles.foundButton} accessibilityLabel="I Found You!">
            <Text style={styles.foundText}>I Found You!</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => stopMatching()}
          style={styles.matchmakeButton}
            accessibilityLabel="Cancel"
          >
            <Text style={styles.matchmakeText}>Cancel</Text>
          </TouchableOpacity>
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
  mysteryMan: {
    width: 200,
    height:200,
  },
  foundText: {
    color:'#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  },
  matchmakeButton:{
    backgroundColor:'#ED5E68', 
    padding:10, 
    borderRadius:20,
    marginBottom:30,
    width:300
  },
  matchmakeText: {
    color:'#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  },
  foundButton: {
    backgroundColor:'#31a9ce', 
    padding:10, 
    borderRadius:20,
    marginBottom:30,
    width:300
  },
  foundText: {
    textAlign: 'center',
    fontSize: 16,
  },
});