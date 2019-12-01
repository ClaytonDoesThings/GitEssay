const fs = require('fs');
const config = require('../../config');

module.exports = (req, res) => {
    var name = encodeURIComponent(req.query.name);

    if (name) {
        if (req.session.auth) {
            let path = ("./db/openEssays/" + req.session.uid + "/" + name);
            if (!fs.existsSync(path)) {
                fs.mkdir(path, {recursive: true}, (err) => {
                    if (!err) {
                        config.simpleGit.cwd(path);
                        config.simpleGit.init(false, (err) => {
                            if (!err) {
                                fs.writeFile(path + '/data.json',
                                    JSON.stringify({
                                        meta: {
                                            format: 1
                                        },
                                        settings: {},
                                        modules: {
                                            title: {
                                                title: "tile",
                                                content: [
                                                    {
                                                        type: "text",
                                                        settings: {
                                                            justify: "center",
                                                            breakLine: true
                                                        },
                                                        content: "New Essay Title"
                                                    }
                                                ]
                                            }
                                        },
                                        content: [
                                            {
                                                type: "module-ref",
                                                module: "title"
                                            },
                                            {
                                                type: "text",
                                                settings: {},
                                                content: "&emsp;Hello!"
                                            }
                                        ]
                                    }, null, 1),
                                (err) => {
                                    if (!err) {
                                        config.simpleGit.cwd(path);
                                        config.simpleGit.add("data.json", (err) => {
                                            if (!err) {
                                                config.simpleGit.cwd(path);
                                                config.simpleGit.commit("init", (err) => {
                                                    if (!err) {
                                                        res.send("Repository had been created.");
                                                    } else {
                                                        console.error(err);
                                                        res.status(500).send("Error commiting staged files.");
                                                    }
                                                });
                                            } else {
                                                console.error(err);
                                                res.status(500).send("Error staging files for commit.");
                                            }
                                        });
                                    } else {
                                        console.error(err);
                                        res.status(500).send("Error writing file.");
                                    }
                                });
                            } else {
                                console.error(err);
                                res.status(500).send("Failed to intialize git repository.");
                            }
                        });
                    } else {
                        console.error(err);
                        res.status(500).send("Failed to make essay folder.");
                    }
                });
            } else {
                res.status(400).send("Essay already exists");
            }
        } else {
            res.status(400).send("Not signed in.");
        }
    } else {
        res.status(400).send("Missing token or name");
    }
};