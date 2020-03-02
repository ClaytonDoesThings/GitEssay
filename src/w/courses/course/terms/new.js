modules = require('../../../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.httpGetAsync +
        modules.session +
        modules.styles +
        `<script>
            var meta = {};

            var loadState = "loading";
            var errorMessage = "";

            session.onAuthChanged((state, userMeta) => {
                if (state) {
                    if (userMeta.uid === window.location.pathname.split("/")[3]) {
                        document.getElementById("delete-modal-button").style.display = "inline";
                    }

                    let req = window.location.origin + "/api/courses/course/${req.params.user}/${encodeURIComponent(req.params.name)}/meta";
                    httpGetAsync(req, (res, err) => {
                        if (!err) {
                            loadState = "authorized";
                            meta = JSON.parse(res);
                            console.log(meta);

                            document.getElementById("title").innerText = meta.title + " - Terms ";
                            updateTerms();
                            document.getElementById("loaded").style.display = "inline";
                        } else {
                            console.error(res);
                        }
                    });
                } else {
                    document.getElementById("loaded").style.display = "none";
                    loadState = "unauthorized";
                    errorMessage = "No authentication";
                }
            });
        </script>`,
        modules.topNav +
        `<div id="loaded" style="display: none">
            <h1 id="title"></h1>
        </div>`
    ));
};