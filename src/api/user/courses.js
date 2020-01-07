const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        let _path = path.join(__dirname, '../../../db/openCourses/', req.params.user);
        if (fs.existsSync(_path)) {
            res.send(fs.readdirSync(_path));
        } else {
            res.send([]);
        }
    } else {
        res.send([]);
    }
};