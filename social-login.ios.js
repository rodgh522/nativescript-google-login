import { Common } from 'nativescript-google-login/social-login.common';
import { Application,  } from '@nativescript/core';
export class SocialLogin extends Common {
    constructor() { 
        super();

        this.config = {};
    }

    init(option){
        this.config = this.defaultConfig;
        this.signInConfig = GIDConfiguration.alloc().initWithClientID(option.clientId);

        GIDSignIn.sharedInstance.restorePreviousSignInWithCallback(option.callback);
    }
    
    login(callback){
        GIDSignIn.sharedInstance.signInWithConfigurationPresentingViewControllerCallback(this.signInConfig, Application.ios.rootController, callback);
    }

    logout(){
        GIDSignIn.sharedInstance.signOut();
    }
}