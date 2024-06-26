var AWS = require('aws-sdk/dist/aws-sdk-react-native');
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {Status} from './Status';
import Pool from "./UserPool";

const BUCKET = 'imagestaken';
var ACCESS_KEY;
var SECRET_ACCESS_KEY;
var SESSIONTOKEN;


AWS.config.region = 'us-east-2';    

//original          
export const uploadToS3 = async (file, userID) => {
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


    try{
        s3.upload({
          Bucket:BUCKET, 
          Key: key, 
          Body: file,
          ContentType: 'image/png',
        }, function(err, data){
          if (err) {
            console.log(err);
            return alert('There was an error uploading your image: ', err.message);
          }
          alert('Uploaded to ' + data.Location);
        }).on('httpUploadProgress', function (progress){
          console.log(progress);
        });
        return {key};
    } 
    catch (error) {
        console.log(error);
        return {error};
    }
    
}; 



