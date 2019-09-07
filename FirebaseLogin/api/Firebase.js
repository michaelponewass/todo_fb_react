import firebase from "firebase";

class Firebase {


  userLogin = (email, password) => {
    return new Promise(resolve => {
/*
      let inLoginProcess=false;
      let currentUser = firebase.auth().currentUser;
      if (currentUser) {
        if (currentUser.isAnonymous) {
          inLoginProcess=true;
          console.log("user is anonymouse");
          let credential = firebase.auth.EmailAuthProvider.credential(email, password);
          currentUser.linkAndRetrieveDataWithCredential(credential)
              .catch(error => {
                switch (error.code) {
                  case 'auth/invalid-email':
                    console.warn('Invalid email address format.');
                    break;
                  case 'auth/user-not-found':
                  case 'auth/wrong-password':
                    console.warn('Invalid email address or password');
                    break;
                  default:
                    console.warn('Check your internet connection. Error Code: ' + error.code);
                }
                resolve(null);
              }).then(usercredential => {
            if (usercredential) {
              console.log("usercredential is called. user: " + user.email);
              resolve(usercredential.user);
            }
          });

        }
      }
*/
//      if (!inLoginProcess) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(error => {
              switch (error.code) {
                case 'auth/invalid-email':
                  console.warn('Invalid email address format.');
                  break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                  console.warn('Invalid email address or password');
                  break;
                default:
                  console.warn('Check your internet connection');
              }
              resolve(null);
            }).then(user => {
          if (user) {
            resolve(user);
          }
        });
 //     }
    })
 };

  /**
   * Get this User's Details
   */
  getUserData = (dispatch) => {
    const UID = (
        FirebaseRef
        && Firebase
        && Firebase.auth()
        && Firebase.auth().currentUser
        && Firebase.auth().currentUser.uid
    ) ? Firebase.auth().currentUser.uid : null;

    if (!UID) return false;

    const ref = FirebaseRef.child(`users/${UID}`);

    return ref.on('value', (snapshot) => {
      const userData = snapshot.val() || [];

      return dispatch({ type: 'USER_DETAILS_UPDATE', data: userData });
    });
  }
  /**
   * create firebase Account with extra data
   * @param name
   * @param email
   * @param password
   * @returns {Promise<any>}
   */
  createFirebaseAccount = (name, email, password) => {
    return new Promise(resolve => {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            console.warn('This email address is already taken');
            break;
          case 'auth/invalid-email':
            console.warn('Invalid e-mail address format');
            break;
          case 'auth/weak-password':
            console.warn('Password is too weak');
            break;
          default:
            console.warn('Check your internet connection');
        }
        resolve(false);
      }).then((res) => {
          // Send user details to Firebase database
          if (res && res.user.uid) {
            firebase.database().ref().child('users').child(res.user.uid).set({
              name,
              signedUp: firebase.database.ServerValue.TIMESTAMP,
              lastLoggedIn: firebase.database.ServerValue.TIMESTAMP,
            }).then(resolve);
        }
      });
    });
  };

  sendEmailWithPassword = (email) => {
    return new Promise(resolve => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          console.warn('Email with new password has been sent');
          resolve(true);
        }).catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              console.warn('Invalid email address format');
              break;
            case 'auth/user-not-found':
              console.warn('User with this email does not exist');
              break;
            default:
              console.warn('Check your internet connection');
          }
          resolve(false);
        });
    })
  };

}

export default new Firebase();
