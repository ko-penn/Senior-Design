import React from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

export default function Create({childToParent}) {

  const [email, onChangeEmail] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="Username"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
        />
        <Button onPress = {() => childToParent("start")}
          title='Create'
          color="#841584"
          accessibilityLabel="Creating Account"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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