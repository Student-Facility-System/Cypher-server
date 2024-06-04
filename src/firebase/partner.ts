import admin, {ServiceAccount} from "firebase-admin";

import serviceAccount from "./cypher-07-firebase-adminsdk-wd50f-8a14065888.json" assert { type: "json" };

const adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
}, 'partner-app');


export const PartnerFirebase = {
    auth: adminApp.auth(),
    firestore: adminApp.firestore(),
    appCheck: adminApp.appCheck(),
    remoteConfig: adminApp.remoteConfig()
}