import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import UserPool from "./UserPool";

export default function Create({childToParent}) {

  const [email, onChangeEmail] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  const onSubmit = (event) => {
    event.preventDefault();

    UserPool.signUp(email, password, [], null, (err, data) => {
        if (err) {
            console.debug(err);
        }
        else{
          childToParent("login");
        }
        console.debug(data);
    });
  };

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
        <TouchableOpacity onPress={onSubmit}
        style={styles.createButton}
          accessibilityLabel="Creating Account"
        >
          <Text style={styles.loginText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => childToParent("login")}
        style={styles.createButton}
          accessibilityLabel="Cancel"
        >
          <Text style={styles.loginText}>Cancel</Text>
        </TouchableOpacity>
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
  loginText: {
    color:'#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16
  },
  createButton: {
    backgroundColor:'#841584', 
    padding:10, 
    borderRadius:20,
    marginBottom:10,
    width:300
  }
});