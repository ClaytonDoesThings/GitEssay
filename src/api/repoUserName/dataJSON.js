const fs = require('fs');
var path = require('path');

module.exports = (req, res) => {
    authenticate(req.query.token, [req.params.user]).then(() => {
        let _path = ("./git/" + req.params.user + "/" + req.params.name);
        if (fs.existsSync(_path)) {
            res.download(path.join(__dirname, "../../." + _path, 'data.json'));
        } else {
            res.status(500).send("Failed to get path");
        }
    }).catch((err) => {
        res.status(400).send(err);
    });
}