import { Firebase, FirebaseRef } from '../lib/firebase';


export function getEnumbers() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    let uid = Firebase.auth().uid;
    return new Promise((resolve, reject) => FirebaseRef.child('users').child(uid).child('feels').once('value')
        .then((snapshot) => {
            const data = snapshot.val() || [];
            return resolve(data);
        }).catch(reject)).catch((err) => { throw err.message; });
}

export function addEnumber(feel) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    let uid = Firebase.auth().uid;
    return new Promise((resolve, reject) => FirebaseRef.child('users').child(uid).child('feels').set(feel)
        .then((success) => {
            return resolve(success);
        }).catch(reject)).catch((err) => { throw err.message; });
}

