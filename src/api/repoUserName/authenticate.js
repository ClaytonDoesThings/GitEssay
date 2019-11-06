config = require('../../config');

module.exports = function authenticate (token, users) {
    return new Promise((resolve, reject) => {
        if (token) {
            config.firebaseAdmin.auth().verifyIdToken(token).then((user)=> {
                if (users.includes(user.uid)) {
                    resolve();
                } else {
                    reject("You do not have authentication for this essay.");
                }
            });
        } else {
            reject("Authentication token is required.");
        }
    });
};