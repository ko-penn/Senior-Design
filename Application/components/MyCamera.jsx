import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Image, Platform } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';
/*https://www.youtube.com/watch?v=4WPjWK0MYMI*/
import { Camera, CameraType } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import Session from './Session';
import { uploadToS3 } from './s3Upload';
import Pool from "./UserPool";


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

  const onUse = (event) => {
    setSess("true");
    const user= Pool.getCurrentUser().getUsername();
    const base64Photo = photo.base64.replace(/^data:image\/\w+;base64,/, "");
    const {error, key} = uploadToS3(base64Photo, user);
    if(error){
      console.debug("onFailure: ", err);
      reject(err);
    }
    else{
      console.debug("success", key)
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
            <Button title="Use" onPress={onUse}/>
            <Button title="Discard" onPress={() => setPhoto(undefined)} />
          </SafeAreaView>
        );
      }
      else{
        return (
          <SafeAreaView style={styles.container}>
            <Image style={styles.comppreview} source={photo} />
            <Button title="Use" onPress={onUse}/>
            <Button title="Discard" onPress={() => setPhoto(undefined)} />
          </SafeAreaView>
        );
      }
    }
    else if (photo && sess) {
      return (
          <Session></Session>
        );
  }
    else if (photo === undefined && isFocused){
      if (plat === 'ios' || plat === 'android'){
        return(
          <Camera style={styles.camera} ref={cameraRef} type={type}>
            <View style={styles.buttonContainer}>
              <Button title="<-" onPress={() => picPressed("false")} />
              <Button title="Take Pic" onPress={takePic} />
              <Button title="Flip Camera" onPress={toggleCameraType} />
            </View>
          </Camera>
        )
      }
      else{
        if(webCameraTypes.length > 1){
          return(
            <Camera style={styles.camera} ref={cameraRef} type={webType}>
              <View style={styles.buttonContainer}>
                <Button title="<-" onPress={() => picPressed("false")} />
                <Button title="Take Pic" onPress={takePic} />
                <Button title="Flip Camera" onPress={toggleWebCameraType} />
              </View>
            </Camera>
          )
        }
        else{
          return(
            <Camera style={styles.compcamera} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <Button title="<-" onPress={() => picPressed("false")} />
                <Button title="Take Pic" onPress={takePic} />
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  compcamera: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  buttonContainer: {
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  comppreview: {
    flex: 1,
    resizeMode: 'contain',
    transform: [{scaleX: -1}],
  },
  imageContainer: {
    flex: 1,
    objectFit: 'contain'
  }
});