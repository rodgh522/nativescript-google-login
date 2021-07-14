import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';

export class Common extends Observable {

  constructor() {
    super();
    this.defaultConfig = {
      activity: void 0,
      viewController: void 0,
      google: {
          initialize: true,
          isRequestAuthCode: false,
          serverClientId: void 0,
          clientId: "",
          shouldFetchBasicProfile: true,
          scopes: ["profile", "email"]
      },
      onActivityResult: void 0
    };

    this.LoginResultType = {
      Success: 0,
      Exception: -1,
      Cancelled: 1,
      Failed: -2
    };
  }

  logResult(resultCtx, tag) {
    for(const p in resultCtx) {
      if (resultCtx.hasOwnProperty(p)) {
          console.log("result. " + p + " = " + resultCtx[p], tag);
      }
    }
  }
}

export class Utils {
  static SUCCESS_MSG() {
    let msg = `Your plugin is working on ${app.android ? 'Android' : 'iOS'}.`;

    setTimeout(() => {
      dialogs.alert(`${msg} For real. It's really working :)`).then(() => console.log(`Dialog closed.`));
    }, 2000);

    return msg;
  }
}
