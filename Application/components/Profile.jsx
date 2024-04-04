import { useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, TouchableOpacity, Image } from 'react-native';
import MyCamera from '../components/MyCamera';
import { getS3Pic } from './s3GetObject';
import Pool from "./UserPool";
import { useEffect } from 'react';

export default function Profile() {

  const [profilePic, setProfilePic] = useState()
  const [pic, setPic] = useState(false);
  const username = Pool.getCurrentUser().getUsername();
  var picSection = null;

  useEffect(() => {
    loadImage();
  }, []); 

  async function loadImage() {
    try {
      const user = Pool.getCurrentUser().getUsername();
      const base64image = await getS3Pic(user); // Wait for the image to be fetched
      setProfilePic(base64image)
      setPic(true)
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  }

  const picPressed = () => {
    if (pic === false){
      setPic(true);
      return (<MyCamera picPressed={picPressed}></MyCamera>);
    }
    else {
      // Do some sort of fullscreen picture view
    }
  }

  if(pic === false){
    picSection = 
      <TouchableOpacity onPress={() => picPressed()}>
        <Image source={require('../assets/Mystery-Man.webp')} style={styles.mysteryMan}></Image>
      </TouchableOpacity>
    ;
  }
  else if (pic === true){
    picSection = 
      <TouchableOpacity onPress={() => picPressed()}>
        <Image source={{ uri: profilePic }} style={styles.mysteryMan} />
      </TouchableOpacity>
    ;
  }

  return (
    <View style={styles.container}>
      {picSection}
      <View style={styles.container}>
        <SectionList
          sections={[
            {
              title: 'Username: ',
              data: [username],
            },
            {
              title: 'Field 2: ',
              data: ['Other Data'],
            },
          ]}
          renderItem={({item}) => <View style={styles.row}><Text style={styles.textStyling}>{item}</Text></View>}
          renderSectionHeader={({section}) => (
            <Text style={[styles.textStyling, styles.textBoldStyling]}>{section.title}</Text>
          )}
          keyExtractor={item => `basicListEntry-${item}`}
        />
      </View>
    </View>
  )

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
  textStyling: {
    textAlign: 'center',
    fontSize: 16,
  },
  textBoldStyling: {
    fontWeight: 'bold',
  },
  row: {
    minWidth: '100%',
    flex: 1,
  },
});