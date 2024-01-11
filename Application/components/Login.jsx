import React, {useState, useContext} from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import { AccountContext } from "./Account";

export default function Login({childToParent}) {

  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const { authenticate } = useContext(AccountContext)

  const onSubmit = (event) => {
    event.preventDefault();

    authenticate(email, password)
      .then(data => {
        console.debug("Logged in!", data);
      })
      .catch(err => {
        console.error("Failed to login", err);
      })
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Username"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
        />
        <TouchableOpacity onPress={onSubmit}
        style={styles.loginButton}
          accessibilityLabel="Logging you in"
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
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
    width: 300,
    borderWidth: 1,
    borderRadius:10,
    padding: 5,
  },
  createtext: {
    textDecorationLine: 'underline',
  },
  loginText: {
    color:'#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  },
  loginButton: {
    backgroundColor:'#841584', 
    padding:10, 
    borderRadius:20,
    marginBottom:30,
    width:300
  }
});