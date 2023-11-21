import React from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

export default function Start({childToParent}) {

  const [description, onChangeDescription] = React.useState('');

  return (
    <View style={styles.container}>
      <Text>Enter a description of yourself:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeDescription}
        value={description}
        placeholder=""
      />
      <Text>--------------- OR ---------------</Text>
      <Text>Enter a description of yourself:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeDescription}
        value={description}
        placeholder=""
      />
      <Button onPress = {() => childToParent("matchmaking")}
        title="Start Matchmaking"
        color="#841584"
        accessibilityLabel="Starting matchmanking" />
    </View>
  );
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
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});