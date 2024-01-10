import { useState } from 'react';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import MyCamera from '../components/MyCamera'; 


export default function Start() {

  const [description, onChangeDescription] = useState('');
  const [pic, setPic] = useState('false');

  const picPressed = () => {
    setPic('true');
  }

  if(pic === 'false'){
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={picPressed}>
          <Image source={require('../assets/Mystery-Man.webp')} style={styles.mysteryMan}></Image>
        </TouchableOpacity>
        <Text>Take a picture of yourself:</Text>
        <Text>--------------- OR ---------------</Text>
        <Text>Enter a description of yourself:</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDescription}
          value={description}
          placeholder=""
        />
          <TouchableOpacity onPress={() => childToParent("start")}
          style={styles.matchmakeButton}
            accessibilityLabel="Starting matchmanking"
          >
            <Text style={styles.matchmakeText}>Start Matchmaking</Text>
          </TouchableOpacity>
      </View>
    );
  }
  else{
    return (<MyCamera></MyCamera>)
  }
  
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 10,
    width: 300,
    borderWidth: 1,
    borderRadius:10,
    padding: 5,
  },
  mysteryMan: {
    width: 200,
    height:200,
  },
  matchmakeText: {
    color:'#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  },
  matchmakeButton: {
    backgroundColor:'#841584', 
    padding:10, 
    borderRadius:20,
    marginBottom:30,
    width:300
  },
});