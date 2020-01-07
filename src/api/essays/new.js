const fs = require('fs');

module.exports = (req, res) => {
    if (req.query.name !== undefined) {
        var name = encodeURIComponent(req.query.name);
        if (req.session.auth) {
            let path = ("./db/openEssays/" + req.session.uid + "/" + name);
            if (!fs.existsSync(path)) {
                fs.mkdir(path, {recursive: true}, (err) => {
                    if (!err) {
                        fs.writeFile(path + '/data.json',
                            JSON.stringify({
                                meta: {
                                    format: 1
                                },
                                settings: {
                                    pageWidth: 210,
                                    pageHeight: 297
                                },
                                modules: {
                                    title: {
                                        title: "title",
                                        content: [
                                            {
                                                type: "block",
                                                settings: {
                                                    justify: "center"
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        settings: {
                                                            fontSize: 16
                                                        },
                                                        content: "New Essay Title"
                                                    }
                                                ]
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
                                        type: "block",
                                        settings: {},
                                        content: [
                                            {
                                                type: "text",
                                                settings: {},
                                                content: "&emsp;This is a new essay."
                                            }
                                        ]
                                    }
                                ]
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