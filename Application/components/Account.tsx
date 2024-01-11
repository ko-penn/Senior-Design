import React, { createContext } from "react";
import Pool from "./UserPool";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

// This file verifys sessions while the user is logged in

const AccountContext = createContext({
    authenticate: (Username, Password) => {},
    getSession: () => {},
    logout: () => {},
  });

const Account = ( props ) => {
    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = Pool.getCurrentUser();
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject();
                    } else { 
                        resolve(session);
                    }
                });
            } else { 
                reject();
            }
        });
    };


    const authenticate = async (Username, Password) => {
       return await new Promise((resolve, reject) => {
           const user = new CognitoUser({ Username, Pool });

           const authDetails = new AuthenticationDetails({ Username: Username, Password: Password });

           user.authenticateUser(authDetails, {
               onSuccess: (data) => {
                   console.debug("onSuccess: ", data);
                   resolve(data);
               },
               onFailure: (err) => {
                   console.debug("onFailure: ", err);
                   reject(err);
               },
               newPasswordRequired: (data) => {
                   console.debug("newPasswordRequired: ", data);
                   resolve(data);
               }
           });
       });
    };

    const logout = () => {
        const user = Pool.getCurrentUser();
        if (user) {
            user.signOut();
        }
    };
    return( 
        <AccountContext.Provider value={{ authenticate, getSession, logout }}>
            {props.children}
        </AccountContext.Provider>
    );
};

export { Account, AccountContext };