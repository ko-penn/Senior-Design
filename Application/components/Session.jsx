/*Page to display your active game, contains image/description, distance, direction, and button to win*/
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from 'react-native';

export default function Session(setSess={setSess}) {

  return (
    <>
        <View style={styles.container}>
            <Text>Session</Text>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});