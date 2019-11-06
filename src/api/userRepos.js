const fs = require('fs');
const path = require('path');
modules = require('../modules');
authenticate = require('./repoUserName/authenticate.js');

module.exports = (req, res) => {
    if (req.query.token) {
        authenticate(req.query.token, req.params.user).then(() => {
            let _path = path.join(__dirname, '../../git/', req.params.user);
            if (fs.existsSync(_path)) {
                res.send(fs.readdirSync(_path));
            } else {
                res.send([]);
            }
        }).catch((err) => {
            res.send([]);
        });
    } else {
        res.send([]);
    }
};