import React from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

export default function Login({childToParent}) {

  const [login, onChangeLogin] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeLogin}
          value={login}
          placeholder="Login"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
        />
        <Button onPress = {() => childToParent("start")}
          title="Login"
          color="#841584"
          accessibilityLabel="Logging you in" />
        <Text style={styles.createtext} onPress={() => childToParent("accountpress")}>
          Create new account
        </Text>
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
    margin: 10,
    width: 200,
    borderWidth: 1,
    padding: 5,
  },
  createtext: {
    textDecorationLine: 'underline',
  },
});