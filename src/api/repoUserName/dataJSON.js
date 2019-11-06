const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    authenticate(req.query.token, [req.params.user]).then(() => {
        let _path = path.join(__dirname, "../../../git/" + req.params.user + "/" + req.params.name, 'data.json');
        if (fs.existsSync(_path)) {
            res.download(_path);
        } else {
            res.status(500).send("Failed to get path");
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
};