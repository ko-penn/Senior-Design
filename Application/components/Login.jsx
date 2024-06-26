import React, {useState, useContext} from 'react';
import { StyleSheet, Text, View, TextInput,TouchableOpacity } from 'react-native';
import { AccountContext } from "./Account";

export default function Login({childToParent, ver}) {

  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [warning, setWarning] = React.useState('');

  const { authenticate } = useContext(AccountContext);

  const onSubmit = (event) => {
    event.preventDefault();

    authenticate(email, password)
      .then(data => {
        setWarning("");
        childToParent("start");
      })
      .catch(err => {
        setWarning("Username/Password are invalid or account has not been confirmed");
        console.error("Failed to login", err);
      })
  };

  return (
    <>
      <View style={styles.container}>
      <Text style={styles.warningText}>{ver}</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
          autoFocus = {true}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          secureTextEntry={true}
          value={password}
          placeholder="Password"
        />
        <Text style={styles.warningText}>{warning}</Text>
        <TouchableOpacity onPress={(onSubmit)}
        style={styles.loginButton}
          accessibilityLabel="Logging you in"
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.createtext} onPress={() => childToParent("accountpress")}>
            Create new account
          </Text>
        </View>
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
    backgroundColor:'#31a9ce', 
    padding:10, 
    borderRadius:20,
    marginBottom:30,
    width:300
  },
  warningText: {
    color: '#FF0000',
    textAlign: 'center'
  }
});