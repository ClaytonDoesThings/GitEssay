modules = require('../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.firebase +
        modules.firebaseAuth +
        modules.httpGetAsync +
        modules.styles +
        `<script>
            var essayData;

            function renderEssayContent(content, modules) {
                var result = "";

                for (i in content) {
                    let c = content[i];
                    switch(c.type) {
                        case "text":
                            result += (
                                "<div class=\\"" +
                                    (c.settings.justify ? "text-justify-" + c.settings.justify + " " : "")
                                + "\\"><span class=\\"editor-main.text\\">" +
                                    c.content +
                                "</span></div>"
                            );
                            if (c.settings.breakLine) {
                                result += "<br/>";
                            }
                            break;
                        case "module-ref":
                            result += renderEssayContent(modules[c.module].content, modules);
                            break;
                    }
                }
                return result;
            }

            var loadState = "loading";
            var errorMessage = "";

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    currentUser.getIdToken(true).then((idToken) => {
                        let req = window.location.origin + "/api/repo/${req.params.user}/${req.params.name}/data?token=" + idToken;
                        httpGetAsync(req, (res, err) => {
                            if (!err) {
                                essayData = JSON.parse(res);
                                console.log(essayData);
                                document.getElementById("editor-main").innerHTML = renderEssayContent(essayData.content, essayData.modules);
                                document.getElementById("authorized").style.display = "block";
                                document.getElementById("unauthorized").style.display = "none";
                            } else {
                                console.error(res);
                                document.getElementById("authorized").style.display = "none";
                                document.getElementById("unauthorized").style.display = "block";
                            }
                        });
                    });
                } else {
                    loadState = "unauthorized";
                    errorMessage = "No authentication";
                }
            });

            function onLoad() {

            }
        </script>`,
        modules.topNav +
        `<div id="authorized" style="display: none">
            <div id="editor">
                <ul id="editor-tools">
                    
                </ul>
                <div id="editor-main">
                </div>
            </div>
        </div>
        <div id="unauthorized" style="display: none">
            Not authorized for this essay.
        </div>`
    ));
};