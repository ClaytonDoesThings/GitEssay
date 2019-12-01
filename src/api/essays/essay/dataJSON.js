const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        let _path = path.join(__dirname, "../../../../db/openEssays/" + req.params.user + "/" + encodeURIComponent(req.params.name), 'data.json');
        if (fs.existsSync(_path)) {
            res.download(_path);
        } else {
            console.error(_path);
            res.status(500).send("Failed to get path");
        }
    } else {
        res.status(400).send("Not authorized.");
    }
};