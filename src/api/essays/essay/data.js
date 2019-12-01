const fs = require('fs');
const path = require('path');
const config = require('../../../config');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        let _path = path.join(__dirname, "../../../../db/openEssays/" + req.params.user + "/" + encodeURIComponent(req.params.name));
        if (fs.existsSync(_path)) {
            fs.readFile(path.join(_path, "/data.json"), (err, data) => {
                if (!err) {
                    res.send(data);
                } else {
                    console.error(err);
                    res.status(500).send("Error reading file.");
                }
            });
        } else {
            res.status(400).send("Essay doesn't exist.");
        }
    } else {
        res.status(400).send("Not authorized.");
    }
};