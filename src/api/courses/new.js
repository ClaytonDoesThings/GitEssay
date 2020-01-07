const fs = require('fs');

module.exports = (req, res) => {
    if (req.query.course !== undefined) {
        var name = encodeURIComponent(req.query.course);
        if (req.session.auth) {
            let path = ("./db/openCourses/" + req.session.uid + "/" + name);
            if (!fs.existsSync(path)) {
                fs.mkdir(path, {recursive: true}, (err) => {
                    if (!err) {
                        fs.writeFile(path + '/data.json',
                            JSON.stringify({
                                title: name,
                                description: "Add a description!"
                            }, null, 1),
                            (err) => {
                                if (!err) {
                                    res.send("Essay has been created.");
                                } else {
                                    console.error(err);
                                    res.status(500).send("Error writing file.");
                                }
                            }
                        );
                    } else {
                        console.error(err);
                        res.status(500).send("Failed to make course folder.");
                    }
                });
            } else {
                res.status(400).send("Course already exists");
            }
        } else {
            res.status(400).send("Not signed in.");
        }
    } else {
        res.status(400).send("Missing token or name");
    }
};