import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import UserPool from "./UserPool";

export default function Create({childToParent}) {

  const [email, onChangeEmail] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmPassword, onChangeConfirmPassword] = React.useState('');
  const [warning, setWarning] = React.useState('');

  const onSubmit = (event) => {
    if(password === confirmPassword){
      event.preventDefault();

      UserPool.signUp(email, password, [], null, (err, data) => {
          if (err) {
              setWarning(err.message);
          }
          else{
            setWarning("");
            childToParent("loginVerif");
          }
      });
    }
    else{
      setWarning("Passwords do not match");
    }
    
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.passwordReqsText}>Password must be at least 8 characters long</Text>
          <Text style={styles.passwordReqsText}>Password must contain at least one upper case letter</Text>
          <Text style={styles.passwordReqsText}>Password must contain at least one numeric character</Text>
          <Text style={styles.passwordReqsText}>Password must contain at least one symbol character</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
          autoFocus = {true}
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
          secureTextEntry={true}
          value={password}
          placeholder="Password"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmPassword}
          secureTextEntry={true}
          value={confirmPassword}
          placeholder="Confirm Password"
        />
        <View>
          <Text style={styles.warningText}>{warning}</Text>
        </View>
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
    backgroundColor:'#31a9ce', 
    padding:10, 
    borderRadius:20,
    marginBottom:10,
    width:300
  },
  warningText: {
    color: '#FF0000',
    textAlign: 'center',
  },
  passwordReqsText: {
    textAlign: 'center',
  }
});