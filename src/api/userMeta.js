config = require('../config');

module.exports = (req, res) => {
    config.firebaseAdmin.auth().getUser(req.params.user).then((user) => {
        user = user.toJSON();
        res.send({
            displayName: user.displayName
        });
    }).catch((err) => {
        console.error(err);
        res.status(500).send("Failed to get user.");
    });
};