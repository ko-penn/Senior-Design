import React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
/*https://www.youtube.com/watch?v=4WPjWK0MYMI*/
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';


export default function MyCamera() {
  let cameraRef = useRef();
  const [hasCameraPermission, sethasCameraPermission] = useState();
  const [hasMediaLibraryPermission, sethasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();

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
        let usePhoto = () => {
            setPhoto(undefined);
        };
        return (
            <SafeAreaView style={styles.container}>
              <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
              <Button title="Use" onPress={usePhoto}/>
              <Button title="Discard" onPress={() => setPhoto(undefined)} />
            </SafeAreaView>
          );
    }
    else if (photo === undefined){
        return(
            <Camera style={styles.container} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <Button title="Take Pic" onPress={takePic} />
              </View>
            </Camera>
          )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  buttonContainer: {
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    alignSelf: 'stretch',
  }
});