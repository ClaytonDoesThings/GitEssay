const firebaseAdmin = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT ? require('firebase-admin') : false;
if (firebaseAdmin) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)),
        databaseURL: "https://git-essay.firebaseio.com"
    });
    console.log("Firebase Admin initalized");
} else {
    console.error("No Firebase Admin Service Account passed through. Program will exit.");
    process.exit(1);
}

module.exports = firebaseAdmin;