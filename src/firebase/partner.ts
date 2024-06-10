import admin, {ServiceAccount} from "firebase-admin";

import serviceAccount from "./cypher-partners-firebase-adminsdk-key.json" assert { type: "json" };

const adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
}, 'partner-app');


export const PartnerFirebase = {
    auth: adminApp.auth(),
    firestore: adminApp.firestore(),
    appCheck: adminApp.appCheck(),
    remoteConfig: adminApp.remoteConfig()
}