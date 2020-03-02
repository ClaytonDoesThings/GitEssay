const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    // req.session.auth && req.session.uid == req.params.user
    if (true) {
        let topPath = path.join(__dirname, "../../../../../db/openCourses/" + req.params.user + "/" + encodeURIComponent(req.params.course));
        if (fs.existsSync(topPath)) {
            var id = req.body.id;
            if (typeof(id) !== "undefined") {
                let termsPath = path.join(topPath, "/terms");
                if (!fs.existsSync(termsPath)) {
                    fs.mkdirSync(termsPath);
                }

                let dataPath = path.join(termsPath, `/${id}.json`);
                if (!fs.existsSync(dataPath)) {
                    let _term = req.body;
                    var term = {};
                    let valid = true;
                    let validId = false;
                    let validData = false;
                    for (var i in _term) {
                        switch (i) {
                            case "id":
                                if (typeof(_term.id) === "string" && _term.id.length > 0) {
                                    term.id = _term.id;
                                } else {
                                    res.status(400).send("Invalid ID");
                                    valid = false;
                                }
                                hasId = true;
                                break;
                            case "data":
                                term.data = {};
                                if (typeof(_term.data) === "object") {
                                    for (let j in _term.data) {
                                        switch (j) {
                                            case "word":
                                                term.data.word = {};
                                                if (typeof(_term.data.word) === "object") {
                                                    let hasWord = false;
                                                    let hasLanguage = false;
                                                    let hasDefinitions = false;
                                                    for (let k in _term.data.word) {
                                                        switch (k) {
                                                            case "word": 
                                                                if (typeof(_term.data.word.word) === "string" && _term.data.word.word.length > 0) {
                                                                    term.data.word.word = _term.data.word.word;
                                                                    hasWord = true;
                                                                } else {
                                                                    res.status(400).send("Invalid word of word of data.");
                                                                    valid = false;
                                                                }
                                                                break;
                                                            case "language":
                                                                if (typeof(_term.data.word.language) === "string" && (_term.data.word.language === "cmn" || _term.data.word.language === "eng")) {
                                                                    term.data.word.language = _term.data.word.language;
                                                                    hasLanguage = true;
                                                                } else {
                                                                    res.status(400).send("Invalid language of word of data.");
                                                                    valid = false;
                                                                }
                                                                break;
                                                            case "definitions":
                                                                term.data.word.definitions = [];
                                                                if (Array.isArray(_term.data.word.definitions) && _term.data.word.definitions.length > 0) {
                                                                    for (let l in _term.data.word.definitions) {
                                                                        let definition = {};
                                                                        if (Object.keys(_term.data.word.definitions[l]).length > 0) {
                                                                            for (let m in _term.data.word.definitions[l]) {
                                                                                if (typeof(_term.data.word.definitions[l][m]) === "object" && (m === "cmn" || m === "eng")) {
                                                                                    definition[m] = {};
                                                                                    let hasMeaning = false;
                                                                                    let hasType = false;
                                                                                    for (let n in _term.data.word.definitions[l][m]) {
                                                                                        switch (n) {
                                                                                            case "meaning":
                                                                                                if (Array.isArray(_term.data.word.definitions[l][m].meaning) && _term.data.word.definitions[l][m].meaning.length > 0) {
                                                                                                    definition[m].meaning = [];
                                                                                                    for (let o in _term.data.word.definitions[l][m].meaning) {
                                                                                                        if (typeof(_term.data.word.definitions[l][m].meaning[o]) === "string" && _term.data.word.definitions[l][m].meaning[o].length > 0) {
                                                                                                            definition[m].meaning.push(_term.data.word.definitions[l][m].meaning[o]);
                                                                                                        } else {
                                                                                                            res.status(400).send("Invalid meaning " + o + " of language " + m + " of definition " + l + " of definitions of word of data.");
                                                                                                            valid = false;
                                                                                                        }

                                                                                                        if (!valid) break;
                                                                                                    }
                                                                                                } else {
                                                                                                    res.status(400).send("Invalid meaning of language " + m + " of definition " + l + " of definitions of word of data.");
                                                                                                    valid = false;
                                                                                                }

                                                                                                if (valid) hasMeaning = true;
                                                                                                break;
                                                                                            case "type":
                                                                                                if (typeof(_term.data.word.definitions[l][m].type) === "string" && _term.data.word.definitions[l][m].type.length > 0) {
                                                                                                    definition[m].type = _term.data.word.definitions[l][m].type;
                                                                                                    hasType = true;
                                                                                                } else {
                                                                                                    res.status(400).send("Invalid type of language " + m + " of definition " + l + " of definitions of word of data.");
                                                                                                    valid = false;
                                                                                                }
                                                                                                break;
                                                                                            default:
                                                                                                res.status(400).send("Invalid key in language " + m + " of definition " + l + " of definitions of word of data: " + n);
                                                                                                valid = false;
                                                                                        }

                                                                                        if (!valid) break;
                                                                                    }

                                                                                    if (valid && (!hasMeaning || !hasType)) {
                                                                                        res.status(400).send("Language " + m + " of definition " + l + " of definitions of word of data must have meaning and type.");
                                                                                        valid = false;
                                                                                    }
                                                                                } else {
                                                                                    res.status(400).send("Invalid language " + m + " of definition " + l + " of definitions of word of data.");
                                                                                    valid = false;
                                                                                }

                                                                                if (!valid) break;
                                                                            }
                                                                        } else {
                                                                            res.status(400).send("Definition " + l + " of definitions of word of data must have more than one translation.");
                                                                            valid = false;
                                                                        }

                                                                        term.data.word.definitions.push(definition);

                                                                        if (!valid) break;
                                                                    }
                                                                } else {
                                                                    res.status(400).send("Invalid definitions of word of data.");
                                                                    valid = false;
                                                                }
                                                                break;
                                                            default:
                                                                res.status(400).send("Invalid key in word of data: " + k);
                                                                valid = false;
                                                        }

                                                        if (!valid) break;
                                                    }
                                                } else {
                                                    res.status(400).send("Word of data must be an object.");
                                                    valid = false;
                                                }
                                                break;
                                            default:
                                                res.status(400).send("Invalid key in data: " + j);
                                                valid = false;
                                        }

                                        if (!valid) break;
                                    }
                                } else {
                                    res.status(400).send("Data must be an object.");
                                    valid = false;
                                }

                                if (Object.keys(term.data).length < 0) {
                                    res.status(400).send("There must be at least 1 type of data in the term.");
                                    valid = false;
                                }
                                hasData = true;
                                break;
                            default:
                                res.status(400).send("Invalid key: " + i);
                                valid = false;
                        }

                        if (!valid) break;
                    }
                    if (valid && (!hasId || !hasData)) {
                        res.status(400).send("Term must have an ID and data.");
                        valid = false;
                    }
                    
                    if (valid) {
                        fs.writeFileSync(dataPath, JSON.stringify(term, null, 1),
                            (err) => {
                                if (!err) {
                                    res.send("Term created.");
                                } else {
                                    console.error(err);
                                    res.status(500).send("Error writing file.");
                                }
                            }
                        );
                    }
                } else {
                    res.status(400).send("Term with same id already exists.");
                }
            } else {
                res.status(400).send("Id must be passed");
            }
        } else {
            res.status(400).send("Course does not exist.");
        }
    } else {
        res.status(400).send("Not authorized.");
    }
};