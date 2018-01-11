import firebase from 'firebase';
import { FIREBASE_CONFIG } from  './_config';

export default {
  init() {
    const config = {
      apiKey: FIREBASE_CONFIG.API_KEY,
      authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
      databaseURL: FIREBASE_CONFIG.DATABASE_URL,
      projectId: FIREBASE_CONFIG.PROJECT_ID,
      storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
      messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID
    };
    firebase.initializeApp(config);
  },
  login(cb, cb_err) {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase.auth().signInWithPopup(provider).then(cb).catch(cb_err);
      })
      .catch((err) => {
        console.error('firebase setPersistence error: ', err);
      });
  },
  logout(cb, cb_err) {
    firebase.auth().signOut().then(cb).catch(cb_err);
  },
  updateRoutines(routines) {
    if (this.currentUser()) {
      firebase.database().ref('users/' + this.currentUser().uid).set({routines: routines});
    } else {
      console.error('user not found');
    }
  },
  addValueEventListener(path, cb) {
    const routineRef = firebase.database().ref('users/' + this.currentUser().uid + '/' + path);
    routineRef.on('value', (snapshot) => {
      cb(snapshot);
    });
  },
  addAuthStateChangedEventListener(cb) {
    firebase.auth().onAuthStateChanged(cb);
  },
  currentUser() {
    return  firebase.auth().currentUser;
  },
}