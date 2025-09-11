var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rept-zoo-kinantan-default-rtdb.asia-southeast1.firebasedatabase.app"
});
