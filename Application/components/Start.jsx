import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import MyCamera from '../components/MyCamera';
import Session from './Session';
import { connect as connectWebSocket, send as sendWebSocket, connectionId, match as setMatchingStatus } from './WebSocketService';
import Spinner from './Spinner';


export default function Start() {

  const [description, onChangeDescription] = useState('');
  const [pic, setPic] = useState('false');
  const [sess, setSess] = useState('false');
  const [match, setMatch] = useState('false');
  const [warning, setWarning] = useState('');


  const picPressed = (val) => {
    setPic(val);
  }

  const descPressed = async () => {
    if(description===''){
      setWarning('Please enter a description first');
    }
    else{
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
  }

  if(pic === 'false' && sess === 'false'){
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => picPressed("true")}>
          <Image source={require('../assets/Mystery-Man.webp')} style={styles.mysteryMan}></Image>
        </TouchableOpacity>
        <View style={styles.center}>
          <Text>Take a picture of yourself:</Text>
          <Text>--------------- OR ---------------</Text>
          <Text>Enter a description of yourself:</Text>
          <Text style={styles.warningText}>{warning}</Text>
        </View>
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
  else if (match === 'true'){
    return(
      <Session></Session>
    )
  }
  else if (sess === 'true'){
    return(
      <Spinner>Looking for someone else</Spinner>
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
  center: {
    alignItems: 'center'
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
    backgroundColor:'#31a9ce', 
    padding:10, 
    borderRadius:20,
    marginBottom:30,
    width:300
  },
  warningText: {
    color: '#FF0000'
  }
});