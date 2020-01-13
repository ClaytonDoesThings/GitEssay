modules = require('../../../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.httpGetAsync +
        modules.session +
        modules.styles +
        `<script>
            var courseMeta = {};

            var loadState = "loading";
            var errorMessage = "";

            session.onAuthChanged((state, userMeta) => {
                if (state) {
                    console.log("Hi, " + userMeta.displayName);
                    let req = window.location.origin + "/api/courses/course/${req.params.user}/${encodeURIComponent(req.params.name)}/meta";
                    httpGetAsync(req, (res, err) => {
                        if (!err) {
                            loadState = "authorized";
                            courseMeta = JSON.parse(res);
                            console.log(courseMeta);

                            document.getElementById("loaded").style.display = "inline";
                        } else {
                            console.error(res);
                        }
                    });
                }
            });
        </script>`,
        `
            <div id="loaded">
                
            </div>
        `
        )
    );
};