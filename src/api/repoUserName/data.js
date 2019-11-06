const fs = require('fs');
config = require('../../config');
authenticate = require('./authenticate.js');

module.exports = (req, res) => {
    authenticate(req.query.token, [req.params.user]).then(() => {
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
    }).catch((err) => {
        res.status(400).send(err);
    });
};