const fs = require('fs');
const path = require('path');
const config = require('../../../config');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        let _path = path.join(__dirname, "../../../../db/openEssays/" + req.params.user + "/" + encodeURIComponent(req.params.name));
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
    } else {
        res.status(400).send("Not authorized.");
    }
};