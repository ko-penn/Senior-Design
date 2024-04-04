import React, { useState }  from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Button, SafeAreaView, Image, Platform } from 'react-native';
import {  disconnect } from './WebSocketService';
import Start from './Start';


const Spinner = ({ children }) => {
  const [cancel, setCancel] = useState('false');

  const stopMatching = async () => {
    
    disconnect()
    setCancel(true);
  }


  if(cancel === true){
    return(
    <Start></Start>
    )
  }
  else{
    return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <View style={styles.textContainer}>
        <Text>{children}</Text>
      </View>
      <TouchableOpacity onPress={() => stopMatching()}
          style={styles.matchmakeButton}
            accessibilityLabel="Cancel"
          >
            <Text style={styles.matchmakeText}>Cancel</Text>
          </TouchableOpacity>
    </View>
    
    );
  }

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 20, // Adjust spacing as needed
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
  loginText: {
    color:'#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  },
});

export default Spinner;