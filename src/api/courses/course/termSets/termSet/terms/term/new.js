const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        var termData;
        try {
            termData = req.body;
            console.log(termData);
            let termDataKeys = Object.keys(termData);
            if (
                termDataKeys.length !== 1 ||
                termDataKeys[0] !== "definitions"
            ) {
                console.log(Object.keys(termData));
                throw "Invalid top-level keys";
            }

            if (!Array.isArray(termData.definitions) || termData.definitions.length === 0) {
                console.log(typeof(termData.definitions));
                throw "Invalid definitions";
            }

            for (let i in termData.definitions) {
                let definition = termData.definitions[i];
                let definitionKeys = Object.keys(definition);
                if (
                    typeof(definition) !== "object" ||
                    definitionKeys.length !== 3
                ) {
                    throw "Invalid definition " + i;
                }

                if (typeof(definition.type) !== "string" || !(definition.type.length > 0 && definition.type.length <= 20)) {
                    throw "Invalid type of definition " + i;
                }

                var value = definition.value;
                console.log(value);
                switch (definition.realType) {
                    case ("string"):
                        if (typeof(value) !== "object" || Object.keys(value).length !== 2) {
                            throw "Invalid length or value type of real type string of definition " + i;
                        }
                        for (let j in value) {
                            let v = value[j];
                            switch (j) {
                                case ("inputs"):
                                    if (!Array.isArray(v) || !(v.length > 0 && v.length <= 5)) {
                                        throw "Invalid inputs of real type string of definition " + i;
                                    }
                                    for (let k in v) {
                                        let s = v[k];
                                        if (typeof(s) !== "string" || !(s.length > 0 && s.length <= 2500)) {
                                            throw "Invalid input " + k + " of real type string of definition " + i;
                                        }
                                    }
                                    break;
                                case ("options"):
                                    if (typeof(v) !== "object" || Object.keys(v).length !== 3) {
                                        throw "Invalid length or value of options of real type string of definition " + i;
                                    }
                                    for (let k in v) {
                                        let o = v[k];
                                        switch (k) {
                                            case ("typeable"):
                                            case ("drawable"):
                                            case ("caseSensitive"):
                                                if (typeof(o) !== "boolean") {
                                                    throw "Invalid value of option " + k + " in value of real type string of definition " + i;
                                                }
                                                break;
                                            default:
                                                throw "Invalid option " + k + " in value of real type string of definition " + i;
                                        }
                                    }
                                    break;
                                default:
                                    throw "Invalid key " + j + " in real type string of definition " + i;
                            }
                        }
                        break;
                    default:
                        throw "Failed to match real type of definition " + i;
                }
            }
        } catch (e) {
            console.error(e);
            if (typeof(e) === "string") {
                res.status(400).send(e);
                return;
            }
            termData = false;
        }
        if (termData !== false) {
            var topPath = path.join(__dirname, "../../../../../db/openCourses/" + req.params.user + "/" + encodeURIComponent(req.params.course));
            if (fs.existsSync(topPath)) {
                var termsPath = path.join(topPath, "terms");
                if (!fs.existsSync(termsPath)) {
                    fs.mkdirSync(termsPath);
                }
                res.status(500).send("No.");
            } else {
                res.status(400).send("Course does not exist.");
            }
        } else {
            res.status(400).send("Term data invalid.");
        }
    } else {
        res.status(400).send("Not authorized.");
    }
};