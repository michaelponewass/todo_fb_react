import { Firebase, FirebaseRef } from '../lib/firebase';


export function getEnumbers(uid) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    console.log("uid vor getEnumbers: " + uid);
    return new Promise((resolve, reject) => FirebaseRef.child('feels').child(uid).once('value')
        .then((snapshot) => {
            const data = snapshot.val() || [];
            return resolve(data);
        }).catch(reject)).catch((err) => { throw err.message; });
}

export function addEnumber(feel, uid) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    console.log("uid vor addEnumber: " + uid);
    return new Promise((resolve, reject) => FirebaseRef.child('feels').child(uid).set(feel)
        .then((success) => {
            return resolve(success);
        }).catch(reject)).catch((err) => { throw err.message; });
}

