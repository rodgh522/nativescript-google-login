import { Common } from './social-login.common';
import { Application, AndroidApplication } from '@nativescript/core';

const actionRunnable = (function () {
    return java.lang.Runnable.extend({
        action: undefined,
        run: function () {
            this.action();
        }
    });
})();

export class SocialLogin extends Common {
    
    constructor(){
        super();
        this._onActivityResult = (res)=> {
            const requestCode = res.requestCode;
            const resultCode = res.resultCode;
            const intent = res.intent;
            console.log('reqcode=> ' + requestCode, 'resCode=> ' + resultCode, 'intent=> ' + intent);

            if (requestCode === SocialLogin._rcGoogleSignIn) {
                const resultCtx = {};
                const callback = this._loginCallback;
                let activityResultHandled = false;
                this._handleResult = false;
                try {
                    resultCtx.provider = "google";
                    activityResultHandled = true;
                    console.log('OK_Code=> ' + android.app.Activity.RESULT_OK);
                    if (resultCode === android.app.Activity.RESULT_OK) {

                        const signInResult = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInResultFromIntent(intent);
                        
                        if (signInResult.isSuccess()) {
                            console.log("Success");
                            resultCtx.code = this.LoginResultType.Success;
                            const account = signInResult.getSignInAccount();
                            const usrId = account.getId();
                            if (usrId) {
                                resultCtx.id = usrId;
                            }
                            const photoUrl = account.getPhotoUrl();
                            if (photoUrl) {
                                resultCtx.photo = photoUrl.toString();
                            }
                            resultCtx.authToken = account.getIdToken();
                            resultCtx.authCode = account.getServerAuthCode();
                            resultCtx.userToken = account.getEmail();
                            resultCtx.displayName = account.getDisplayName();
                            resultCtx.firstName = account.getGivenName();
                            resultCtx.lastName = account.getFamilyName();
                        }
                        else {
                            resultCtx.code = this.LoginResultType.Failed;
                            resultCtx.code = signInResult.getStatus();
                        }
                    }else if (resultCode === android.app.Activity.RESULT_CANCELED) {
                        console.log("Cancelled");
                        resultCtx.code = this.LoginResultType.Cancelled;
                    }
                }catch (e) {
                    console.log("[ERROR] " + e);
                    resultCtx.code = this.LoginResultType.Exception;
                    resultCtx.error = e;
                }finally{
                    if (!activityResultHandled && this.config.onActivityResult) {
                        console.log("Handling onActivityResult() defined in config...");
                        this.config.onActivityResult(requestCode, resultCode, intent);
                    }
                    console.log("Calling Callback function with Results");
                    callback && callback(resultCtx);
                    Application.android.off(AndroidApplication.activityResultEvent, this._onActivityResult);
                }
            }
        }

        this.config = {};
    }

    init(){
        const gso = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestEmail()
        .build();

        console.log('gso', gso);
        this.defaultConfig.activity = Application.android.foregroundActivity;
        this.config = this.defaultConfig;
        this.googleClient = com.google.android.gms.auth.api.signin.GoogleSignIn.getClient(this.config.activity, gso);
    }

    login(callback){
        try{
            this._loginCallback = callback;
            const uiAction = new actionRunnable();
            uiAction.action = ()=> {
                try{
                    const signIntent = this.googleClient.getSignInIntent();
                    this.config.activity.startActivityForResult(signIntent, SocialLogin._rcGoogleSignIn);
                }catch(e){
                    console.log('[Error] runOnUiThread(): ' + e);
                }
            }

            this.config.activity.runOnUiThread(uiAction);
        }catch(e){
            console.log('[Error] ' + e);
            throw e;
        }finally{
            Application.android.on(AndroidApplication.activityResultEvent, this._onActivityResult);
        }
    }

}
SocialLogin._rcGoogleSignIn = 597;
SocialLogin._handleResult = false;
SocialLogin.LOGTAG_ON_ACTIVITY_RESULT = "onActivityResult()";
