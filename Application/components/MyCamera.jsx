import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';
//https://www.youtube.com/watch?v=4WPjWK0MYMI
import { Camera, CameraType } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import Session from './Session';
import { uploadToS3 } from './s3Upload';
import Pool from "./UserPool";
import { connect as connectWebSocket, send as sendWebSocket, connectionId, match as setMatchingStatus } from './WebSocketService';
import Spinner from './Spinner';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

    if (photo && sess==='false') { //viewing photo
      if (plat === 'ios' || plat === 'android'){
        return (
          <View style={styles.containerNEW}>
            <Image style={styles.preview} source={photo} />
            <View style={styles.buttonContainerNEW}>
              <TouchableOpacity onPress={() => setPhoto(undefined)} style={styles.buttonBackground}>
                <Ionicons name={'trash-outline'} color={'#31a9ce'} size={30}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onStartMatchmaking} style={styles.buttonBackground}>
                <Ionicons name={'play'} color={'#31a9ce'} size={30}/>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
      else{
        return (
          <View style={styles.containerNEW}>
            <Image style={styles.comppreview} source={photo} />
            <View style={styles.buttonContainerNEW}>
              <TouchableOpacity onPress={() => setPhoto(undefined)} style={styles.buttonBackground}>
                <Ionicons name={'trash-outline'} color={'#31a9ce'} size={30}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onStartMatchmaking} style={styles.buttonBackground}>
                <Ionicons name={'play'} color={'#31a9ce'} size={30}/>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
    else if (match === 'true') { //in match
      return (
        <Session></Session>
      );
    }
    else if (sess === 'true'){ //in matchmaking
      return(
        <Spinner>Looking for someone else</Spinner>
      )
    }
    else if (photo === undefined && isFocused){ //viewing camera
      if (plat === 'ios' || plat === 'android'){
        return(
          <View style={styles.containerNEW}>
            <Camera style={styles.cameraNEW} ref={cameraRef} type={type}>
              <View style={styles.buttonContainerNEW}>
                <TouchableOpacity onPress={() => picPressed("false")} style={styles.buttonBackground}>
                  <Ionicons name={'arrow-back-sharp'} color={'#31a9ce'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePic} style={styles.buttonBackground}>
                  <Ionicons name={'camera'} color={'#31a9ce'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCameraType} style={styles.buttonBackground}>
                  <Ionicons name={'camera-reverse'} color={'#31a9ce'} size={30}/>
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        )
      }
      else{
        return(
          <View style={styles.containerNEW}>
            <Camera style={styles.compcameraNEW} ref={cameraRef} type={webType}>
              <View style={styles.buttonContainerNEW}>
                <TouchableOpacity onPress={() => picPressed("false")} style={styles.buttonBackground}>
                  <Ionicons name={'arrow-back-sharp'} color={'#31a9ce'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={takePic} style={styles.buttonBackground}>
                  <Ionicons name={'camera'} color={'#31a9ce'} size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleWebCameraType} style={styles.buttonBackground}>
                  <Ionicons name={'camera-reverse'} color={'#31a9ce'} size={30}/>
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        )
      }
    }
  }
}

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    resizeMode: 'contain',
    transform: [{scaleX: -1}],
  },
  comppreview: {
    flex: 1,
    resizeMode: 'contain',
    transform: [{scaleX: -1}],
  },
  containerNEW: {
    width: '100%',
    maxWidth: 800,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraNEW: {
    width: '100%',
    maxWidth: 800,
    height: '100%',
    justifyContent: 'flex-end',
  },
  compcameraNEW: {
    width: '100%',
    maxWidth: 800,
    height: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainerNEW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  buttonBackground: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius:10,
    alignItems: 'center'
  }
});