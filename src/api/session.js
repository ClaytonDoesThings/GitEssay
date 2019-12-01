const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    let auth = (typeof(req.session.auth) !== "undefined" ? req.session.auth : false);
    res.send({
        auth: auth,
        userMeta: auth ? JSON.parse(fs.readFileSync(path.join(__dirname, '../../db/users/', req.session.uid, 'meta.json'))) : undefined
    });
};