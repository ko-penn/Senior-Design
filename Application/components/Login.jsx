import React from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

export default function Login({childToParent}) {

  const [login, onChangeLogin] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return (
    <>
      <View style={styles.login}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeLogin}
          value={login}
          placeholder="Login"
        />
      </View>
      <View style={styles.password}>
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
        />
      </View>
      <Button onPress = {() => childToParent("loginpress")}
        title="Login"
        color="#841584"
        accessibilityLabel="Logging you in" />
      <View style={styles.create}>
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
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  login: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  password: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  create: {
    marginTop: 5,
  },
  createtext: {
    textDecorationLine: 'underline',
  },
});