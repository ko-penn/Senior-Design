import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import UserPool from "./UserPool";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();

        UserPool.signUp(email, password, [], null, (err, data) => {
            if (err) {
                console.debug(err);
            }
            console.debug(data);
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <Text>Email</Text>
                <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                ></input>
                <Text>password</Text>
                <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                ></input>

                <button type="submit">SignUp</button>
            </form>
        </div>
    )
}

export default SignUp;