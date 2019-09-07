import { Firebase, FirebaseRef } from '../lib/firebase';
/**
 * Get Users from users.
 */
export function getUsers() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return new Promise((resolve, reject) => FirebaseRef.child('users').once('value')
        .then((snapshot) => {
            const data = snapshot.val() || [];
            return resolve(data);
        }).catch(reject)).catch((err) => { throw err.message; });
}
