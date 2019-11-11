const fs = require('fs');
config = require('../config');

module.exports = (req, res) => {
    var token = req.query.token;
    var name = req.query.name;

    if (token && name) {
        config.firebaseAdmin.auth().verifyIdToken(token).then((user)=> {
            let path = ("./git/" + user.uid + "/" + name);
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
                        res.status(500).send("Failed to make repository folder.");
                    }
                });
            } else {
                res.status(400).send("Repo already exists");
            }
        }).catch((err) => {
            console.error(err);
            res.status(400).send("Error while verifying user.");
        })
    } else {
        res.status(400).send("Missing token or name");
    }
};