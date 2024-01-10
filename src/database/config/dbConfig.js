const admin = require('firebase-admin');

const serviceAccount = require('../../serviceAccountKeys.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const storage = admin.storage(); 

module.exports = { db, admin, storage };
