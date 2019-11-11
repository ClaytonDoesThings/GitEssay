const fs = require('fs');
const path = require('path');
config = require('../../config');
authenticate = require('./authenticate.js');

module.exports = (req, res) => {
    authenticate(req.query.token, [req.params.user]).then(() => {
        let _path = path.join(__dirname, "../../../git/" + req.params.user + "/" + req.params.name);
        if (fs.existsSync(_path)) {
            fs.rmdir(_path, {recursive: true}, (err) => {
                if (!err) {
                    res.send("Successfully deleted essay");
                } else {
                    console.error(err);
                    res.status(500).send("Failed to delete essay folder");
                }
            });
        } else {
            res.status(400).send("Essay doesn't exist.");
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
};