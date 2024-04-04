var AWS = require('aws-sdk/dist/aws-sdk-react-native');
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {Status} from './Status';
import Pool from "./UserPool";

const BUCKET = 'imagestaken';
var ACCESS_KEY;
var SECRET_ACCESS_KEY;
var SESSIONTOKEN;


AWS.config.region = 'us-east-2';    

export const getS3Pic = async (userID) => { 
    const key = userID;
      
    var cognitoUser = Pool.getCurrentUser();
  
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, result) {
        if (result) {
          console.log('You are now logged in.');
    
          // Add the User's Id Token to the Cognito credentials login map.
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:b4ef0dfa-a450-4f30-b822-8da09b94fa32',
            Logins: {
              'cognito-idp.us-east-2.amazonaws.com/us-east-2_xVmnDDcCP': result.getIdToken().getJwtToken()
            }
          });
        }
      });
    }
  
    AWS.config.credentials.refresh((error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Successfully logged!');
     }
    });
    
    AWS.config.credentials.get(function(){
  
      // Credentials will be available when this function is called.
      ACCESS_KEY = AWS.config.credentials.accessKeyId;
      SECRET_ACCESS_KEY = AWS.config.credentials.secretAccessKey;
      SESSIONTOKEN = AWS.config.credentials.sessionToken;
  
  
    });
  
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: 'imagestaken'}
    })
  
    try {
      // Convert the s3.getObject operation into a Promise
      const data = await s3.getObject({
        Bucket: BUCKET,
        Key: key,
      }).promise(); // Add .promise() here to get a Promise
      
      return "data:image/png;base64,"+data.Body.toString(); // Return the base64Image string
    } catch (err) {
      console.log(err);
      alert('There was an error getting your image: ', err.message);
      return ''; // Return an empty string or any other error handling
    }
  }