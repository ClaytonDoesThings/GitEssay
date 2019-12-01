const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = (req, res) => {
    let userPath = path.join(__dirname, '../../../db/users/', req.params.user, 'meta.json');
    fs.exists(userPath, (exists) => {
        if (exists) {
            fs.readFile(userPath, (err, data) => {
                if (!err) {
                    let user = JSON.parse(data);
                    res.send(user);
                } else {
                    console.error(err);
                    res.status(500).send("Failed to read user data.");
                }
            });
        } else {
            console.error(err);
            res.status(400).send("User does not exit.");
        }
    });
};