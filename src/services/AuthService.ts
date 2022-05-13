import { CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import * as AWS from "aws-sdk";
import { Credentials } from "aws-sdk";
import { config } from "./config";
import { User, UserAttribute } from "../model/Model";

Amplify.configure({
    Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: config.IDENTITYPOOL_ID,

        // REQUIRED - Amazon Cognito Region
        region: config.REGION,

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: config.REGION,

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: config.USERPOOL_ID,

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: config.APP_CLIENT_ID,

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        // cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        //    domain: '.yourdomain.com',
        // OPTIONAL - Cookie path
        //    path: '/',
        // OPTIONAL - Cookie expiration in days
        //    expires: 365,
        // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        //    sameSite: "strict" | "lax",
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        //   secure: true
        // },

        // OPTIONAL - customized storage object
        // storage: MyStorage,

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: "USER_PASSWORD_AUTH",

        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        // clientMetadata: { myCustomKey: 'myCustomValue' },

        // OPTIONAL - Hosted UI configuration
        // oauth: {
        //     domain: 'your_cognito_domain',
        //     scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        //     redirectSignIn: 'http://localhost:3000/',
        //     redirectSignOut: 'http://localhost:3000/',
        //     responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        // }
    },
});

export class AuthService {
    public async login(userName: string, password: string): Promise<User | undefined> {
        try {
            const user: CognitoUser = await Auth.signIn(userName, password);
            return {
                userName: user.getUsername(),
                cognitoUser: user,
            };
        } catch (e) {
            return undefined;
        }
    }

    public async getUserAttributes(user: User): Promise<UserAttribute[]> {
        const result: UserAttribute[] = [];
        const attrs = await Auth.userAttributes(user.cognitoUser);
        result.push(...attrs);
        return result;
    }

    public async getTemporaryCredentials(user: CognitoUser): Promise<void> {
        const userPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USERPOOL_ID}`;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials(
            {
                IdentityPoolId: config.IDENTITYPOOL_ID,
                Logins: {
                    [userPool]: user.getSignInUserSession()!.getIdToken().getJwtToken(),
                },
            },
            {
                region: config.REGION,
            }
        );
        await this._refreshCredentials();
    }

    private async _refreshCredentials(): Promise<void> {
        return new Promise((resolve, reject) => {
            (AWS.config.credentials as Credentials).refresh((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}
