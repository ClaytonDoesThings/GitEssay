modules = require('../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.firebase +
        modules.firebaseAuth +
        modules.httpGetAsync +
        modules.styles +
        `<script>
            var meta = {};

            var loadState = "loading";
            var errorMessage = "";

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    currentUser.getIdToken(true).then((idToken) => {
                        let req = window.location.origin + "/api/repo/${req.params.user}/${req.params.name}/meta?token=" + idToken;
                        httpGetAsync(req, (res, err) => {
                            if (!err) {
                                loadState = "authorized";
                                meta = JSON.parse(res);
                                console.log(meta);

                                document.getElementById("title").innerText = meta.title;
                                document.getElementById("loaded").style.display = "inline";
                            } else {
                                console.error(res);
                            }
                        });
                    });
                } else {
                    loadState = "unauthorized";
                    errorMessage = "No authentication";
                }
            });
            function download() {
                if (loadState === "authorized") {
                    firebase.auth().currentUser.getIdToken(true).then((idToken) => {
                        window.location.href = (window.location.origin + "/api/repo/${req.params.user}/${req.params.name}/data.json?token=" + idToken);
                    });
                }
            }
        </script>`,
        modules.topNav +
        `<div id="loaded" style="display: none;">
            <h1 id="title">No Title</h1>
            <a href="/w/repo/${req.params.user}/${req.params.name}/edit">Edit</a> <a href="javascript:download()">Download</a>
        </div>`
    ));
};