import { CognitoUserPool } from "amazon-cognito-identity-js"; 

const poolData = {
    UserPoolId: "us-east-2_xVmnDDcCP",
    ClientId: "5gc42t3nca5s7d5ia2mme2fnkg",
}

export default new CognitoUserPool(poolData);