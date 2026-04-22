const admin = require('firebase-admin');

let db = null;

function initFirebase() {
  if (admin.apps.length > 0) return admin.apps[0];

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // Fallback for local dev without full credentials
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'nomadnest-goa-demo',
    });
  }

  db = admin.firestore();
  console.log('✅ Firebase initialized');
  return admin.apps[0];
}

function getDb() {
  if (!db) {
    initFirebase();
  }
  return db;
}

module.exports = { initFirebase, getDb, admin };
