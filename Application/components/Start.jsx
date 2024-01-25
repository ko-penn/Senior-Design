import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import MyCamera from '../components/MyCamera';
import Session from './Session';


export default function Start() {

  const [description, onChangeDescription] = useState('');
  const [pic, setPic] = useState('false');
  const [sess, setSess] = useState('false');
  const [warning, setWarning] = useState('');


  const picPressed = (val) => {
    setPic(val);
  }

  const descPressed = () => {
    if(description===''){
      setWarning('Please enter a description first');
    }
    else{
      setWarning('');
      setSess('true');
    }
  }

  if(pic === 'false' && sess === 'false'){
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => picPressed("true")}>
          <Image source={require('../assets/Mystery-Man.webp')} style={styles.mysteryMan}></Image>
        </TouchableOpacity>
        <Text>Take a picture of yourself:</Text>
        <Text>--------------- OR ---------------</Text>
        <Text>Enter a description of yourself:</Text>
        <Text style={styles.warningText}>{warning}</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDescription}
          value={description}
          placeholder=""
        />
          <TouchableOpacity onPress={() => descPressed()}
          style={styles.matchmakeButton}
            accessibilityLabel="Starting matchmaking"
          >
            <Text style={styles.matchmakeText}>Start Matchmaking</Text>
          </TouchableOpacity>
      </View>
    );
  }
  else if (pic === 'true' && sess === 'false'){
    return (<MyCamera picPressed={picPressed}></MyCamera>)
  }
  else if (sess === 'true'){
    return(
      <Session></Session>
    )
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
  warningText: {
    color: '#FF0000'
  }
});