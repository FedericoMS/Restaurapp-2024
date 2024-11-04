// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyDPv8fGdo3mb76upJou0gsZm98Vxv5JEP0",
    authDomain: "pps-sp-2024.firebaseapp.com",
    projectId: "pps-sp-2024",
    storageBucket: "pps-sp-2024.appspot.com",
    messagingSenderId: "251184336543",
    appId: "1:251184336543:web:524b1e99eeb2de3966dcaa"
  },
  fcmUrl: 'https://fcm.googleapis.com/v1/projects/pps-sp-2024/messages:send',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
