const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        let _path = path.join(__dirname, "../../../../db/openCourses/" + req.params.user + "/" + encodeURIComponent(req.params.course));
        if (fs.existsSync(_path)) {
            fs.rmdir(_path, {recursive: true}, (err) => {
                if (!err) {
                    res.send("Successfully deleted course");
                } else {
                    console.error(err);
                    res.status(500).send("Failed to delete course folder");
                }
            });
        } else {
            res.status(400).send("Course doesn't exist.");
        }
    } else {
        res.status(400).send("Not authorized.");
    }
};