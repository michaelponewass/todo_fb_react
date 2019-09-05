import { Firebase, FirebaseRef } from '../lib/firebase';
/**
 * Get Users
 */
export function getUsers() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return new Promise((resolve, reject) => FirebaseRef.child('meals').once('value')
        .then((snapshot) => {
            const data = snapshot.val() || [];
            return resolve(data);
        }).catch(reject)).catch((err) => { throw err.message; });
}

export function getTodos() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return new Promise((resolve, reject) => FirebaseRef.child('todos').once('value')
        .then((snapshot) => {
            const data = snapshot.val() || [];
            return resolve(data);
        }).catch(reject)).catch((err) => { throw err.message; });
}

export function getEnumbers() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return new Promise((resolve, reject) => FirebaseRef.child('feels').once('value')
        .then((snapshot) => {
            const data = snapshot.val() || [];
            return resolve(data);
        }).catch(reject)).catch((err) => { throw err.message; });
}

export function addTodo(task) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return new Promise((resolve, reject) => FirebaseRef.child('todos').set(task)
        .then((success) => {
            return resolve(success);
        }).catch(reject)).catch((err) => { throw err.message; });
}

export function addEnumber(feel) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return new Promise((resolve, reject) => FirebaseRef.child('feels').set(feel)
        .then((success) => {
            return resolve(success);
        }).catch(reject)).catch((err) => { throw err.message; });
}

/**
 * Get Recipes
 */
export function getRecipes() {
    if (Firebase === null) return () => new Promise(resolve => resolve());

    return dispatch => new Promise(resolve => FirebaseRef.child('recipes')
        .on('value', (snapshot) => {
            const data = snapshot.val() || [];
            return resolve(dispatch({ type: 'RECIPES_REPLACE', data }));
        })).catch((err) => { throw err.message; });
}
