import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Image, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';
/*https://www.youtube.com/watch?v=4WPjWK0MYMI*/
import { Camera, CameraType } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import Session from './Session';
import { uploadToS3 } from './s3Upload';
import Pool from "./UserPool";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SettingsCamera() {
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

    if (photo) {
      if (plat === 'ios' || plat === 'android'){
        return (
          <View style={styles.containerNEW}>
            <Image style={styles.preview} source={photo} />
            <View style={styles.buttonContainerNEW}>
              <TouchableOpacity onPress={() => setPhoto(undefined)} style={styles.buttonBackground}>
                <Ionicons name={'trash-outline'} color={'#31a9ce'} size={30}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={onUse} style={styles.buttonBackground}>
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
              <TouchableOpacity onPress={onUse} style={styles.buttonBackground}>
                <Ionicons name={'play'} color={'#31a9ce'} size={30}/>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    }
    else if (photo === undefined && isFocused){
      if (plat === 'ios' || plat === 'android'){
        return(
          <View style={styles.containerNEW}>
            <Camera style={styles.cameraNEW} ref={cameraRef} type={type}>
              <View style={styles.buttonContainerNEW}>
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