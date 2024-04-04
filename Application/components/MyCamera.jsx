import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Image, Platform } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';
/*https://www.youtube.com/watch?v=4WPjWK0MYMI*/
import { Camera, CameraType } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import Session from './Session';
import { uploadToS3 } from './s3Upload';
import Pool from "./UserPool";
import { connect as connectWebSocket, send as sendWebSocket, connectionId, match as setMatchingStatus } from './WebSocketService';
import Spinner from './Spinner';


export default function MyCamera({picPressed}) {
  let cameraRef = useRef();
  const [hasCameraPermission, sethasCameraPermission] = useState();
  const [type, setType] = useState(CameraType.back);
  const [webType, setWebType] = useState(CameraType.back);
  const [webCameraTypes, setWebCameraTypes] = useState([]);
  const [photo, setPhoto] = useState();
  const [sess, setSess] = useState('false');
  const isFocused = useIsFocused();
  const plat = Platform.OS;
  const [match, setMatch] = useState('false');
  const [warning, setWarning] = useState('');

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function toggleWebCameraType() {
    setWebType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  if(plat !== 'ios' && plat != 'android'){
    async () => {
      setWebCameraTypes(await Camera.getAvailableCameraTypesAsync());
    }
  }

  const onStartMatchmaking = async () => {
    const user= Pool.getCurrentUser().getUsername();
    const base64Photo = photo.base64.replace(/^data:image\/\w+;base64,/, "");
    const {error, key} = uploadToS3(base64Photo, user);
    if(error){
      console.debug("onFailure: ", err);
      reject(err);
    }
    else{
      console.debug("success", key)
      await connectWebSocket('wss://51yp9d18ye.execute-api.us-east-2.amazonaws.com/production/')
      .then(() => {
        setWarning('');
        console.log(connectionId);
        setSess('true');
      })
      .catch((error) => {
        console.error('Failed to establish WebSocket connection:', error);
        setWarning('Failed to establish WebSocket connection');
      });


      await setMatchingStatus()
      .then(() => {
        setMatch('true');
        console.log("match found")
      })
    }
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      sethasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if(hasCameraPermission === undefined){
    return <Text>Requesting permissions...</Text>
  }
  else if (!hasCameraPermission){
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }
  else if (hasCameraPermission){
    let takePic = async () => {
        let options = {
          quality: 1,
          base64: true,
          exif: false
        };
    
        let newPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(newPhoto);
    };

    if (photo && sess==='false') {
      if (plat === 'ios' || plat === 'android'){
        return (
          <SafeAreaView style={styles.container}>
            <Image style={styles.preview} source={photo} />
            <Button color='#31a9ce' title="Start Matchmaking" onPress={onStartMatchmaking}/>
            <Button color='#31a9ce' title="Discard" onPress={() => setPhoto(undefined)} />
          </SafeAreaView>
        );
      }
      else{
        return (
          <SafeAreaView style={styles.container}>
            <Image style={styles.comppreview} source={photo} />
            <Button color='#31a9ce' title="Start Matchmaking" onPress={onStartMatchmaking}/>
            <Button color='#31a9ce' title="Discard" onPress={() => setPhoto(undefined)} />
          </SafeAreaView>
        );
      }
    }
  else if (match === 'true') {
    return (
        <Session></Session>
    );
  }
  else if (sess === 'true'){
    return(
      <Spinner>Looking for someone else</Spinner>
    )
  }
    else if (photo === undefined && isFocused){
      if (plat === 'ios' || plat === 'android'){
        return(
          <Camera style={styles.camera} ref={cameraRef} type={type}>
            <View style={styles.buttonContainer}>
              <Button color='#31a9ce' title="<-" onPress={() => picPressed("false")} />
              <Button color='#31a9ce' title="Take Pic" onPress={takePic} />
              <Button color='#31a9ce' title="Flip Camera" onPress={toggleCameraType} />
            </View>
          </Camera>
        )
      }
      else{
        if(webCameraTypes.length > 1){
          return(
            <Camera style={styles.camera} ref={cameraRef} type={webType}>
              <View style={styles.buttonContainer}>
                <Button color='#31a9ce' title="<-" onPress={() => picPressed("false")} />
                <Button color='#31a9ce' title="Take Pic" onPress={takePic} />
                <Button color='#31a9ce' title="Flip Camera" onPress={toggleWebCameraType} />
              </View>
            </Camera>
          )
        }
        else{
          return(
            <Camera buttonStyle style={styles.compcamera} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <Button color='#31a9ce' title="<-" onPress={() => picPressed("false")} />
                <Button color='#31a9ce' title="Take Pic" onPress={takePic} />
              </View>
            </Camera>
          )
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    maxWidth: 500,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  compcamera: {
    width: '100%',
    maxWidth: 500,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  buttonContainer: {
    backgroundColor: '#31a9ce',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  comppreview: {
    flex: 1,
    resizeMode: 'contain',
    transform: [{scaleX: -1}],
  }
});