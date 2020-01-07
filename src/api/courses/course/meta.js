const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        let topPath = path.join(__dirname, "../../../../db/openCourses/" + req.params.user + "/" + encodeURIComponent(req.params.course));
        if (fs.existsSync(topPath)) {
            let dataPath = path.join(topPath, "data.json");
            if (fs.existsSync(dataPath)) {
                fs.readFile(dataPath, (err, data) => {
                    if (!err) {
                        let dataJSON = JSON.parse(data);
                        res.send({
                            title: dataJSON.title,
                            description: dataJSON.description
                        });
                    } else {
                        res.status(500).send("Failed to read data file.");
                    }
                });
            }
        } else {
            res.status(400).send("Course does not exist.");
        }
    } else {
        res.status(400).send("Not authorized.");
    }
};