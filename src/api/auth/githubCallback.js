const request = require('request');
const fs = require('fs');
const path = require('path');
const githubAuth = require('../../config/githubAuth.js');

module.exports = (req, res) => {
    request.post(
        `https://github.com/login/oauth/access_token?` +
            `client_id=${githubAuth.clientID}&` +
            `client_secret=${githubAuth.clientSecret}&` +
            `code=${req.query.code}`,
        (err, response, body) => {
            if (!err && response.statusCode === 200) {
                let accessToken = body.split("&")[0].split("=")[1];
                request.get(
                    {
                        url: `https://api.github.com/user?` +
                            `access_token=${accessToken}`,
                        headers: {
                            'User-Agent': "SchoolThings"
                        }
                    },
                    (err, response, body) => {
                        if (!err && response.statusCode === 200) {
                            let user = JSON.parse(body);
                            let uid = "GitHub-" + user.node_id;
                            let userPath = path.join(__dirname, '../../../db/users/', uid);
                            if (!fs.existsSync(userPath)) {
                                let userMeta = {
                                    displayName: user.login,
                                    authProvider: "GitHub",
                                    uid: uid
                                };
                                fs.mkdir(userPath, {recursive: true}, (err) => {
                                    if (!err) {
                                        fs.writeFile(
                                            path.join(userPath, "meta.json"),
                                            JSON.stringify(userMeta),
                                            ((err) => {
                                                if (!err) {
                                                    req.session.auth = true;
                                                    req.session.accessToken = accessToken;
                                                    req.session.uid = uid;
                                                    res.send("<script>window.close()</script>");
                                                } else {
                                                    console.error(err);
                                                    res.status(500).send("Failed to write user file.");
                                                }
                                            })
                                        );
                                    } else {
                                        console.error(err);
                                        res.status(500).send("Failed to create user path.");
                                    }
                                });
                            } else {
                                req.session.auth = true;
                                req.session.accessToken = accessToken;
                                req.session.uid = uid;
                                res.send("<script>window.close()</script>");
                            }
                            
                        } else {
                            console.error(body);
                            res.status(500).send("Error getting GitHub user.");
                        }
                    }
                );
            } else {
                console.error(body);
                res.status(500).send("Error getting access token.");
            }
        }
    );
};