const fs = require('fs');
config = require('../config');

module.exports = (req, res) => {
    let token = req.query.token;

    if (token) {
        config.firebaseAdmin.auth().verifyIdToken(token).then((user)=> {
            let path = ("./git/" + req.params.user + "/" + req.params.name);
            if (fs.existsSync(path)) {
                fs.readFile(path + "/data.json", (err, data) => {
                    if (!err) {
                        res.send(data);
                    } else {
                        console.error(err);
                        res.status(500).send("Error reading file.");
                    }
                });
            } else {
                res.status(400).send("Repository doesn't exist.");
            }
        });
    }
}