modules = require('../../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.httpGetAsync +
        modules.session +
        modules.styles +
        `<script>
            var essayData;

            var activeCell;

            function renderEssayContent(content, modules) {
                var result = [];

                for (i in content) {
                    let c = content[i];
                    switch(c.type) {
                        case "block":
                            let block = document.createElement("div");
                            block.setAttribute("class", (c.settings.justify ? "text-justify-" + c.settings.justify + " " : ""));
                            let blockContent = renderEssayContent(c.content, modules);
                            for (let i in blockContent) {
                                block.appendChild(blockContent[i]);
                            }
                            result.push(block);
                            break;
                        case "text":
                            let text = document.createElement("span");
                            text.setAttribute("class", "editor-main.text");
                            text.setAttribute("style", "font-size: " + ((c.settings.fontSize ? c.settings.fontSize : 12)*(90/(11/(1/72))) + "vw"));
                            text.innerHTML = c.content;
                            text.addEventListener("click", (e) => {
                                var selection = window.getSelection();
                                console.log(selection);
                                console.log(selection.baseNode.data[selection.baseOffset]);
                                var node = selection.baseNode.parentNode;
                                activeCell = [node, selection.baseOffset];
                            });
                            result.push(text);
                            break;
                        case "module-ref":
                            let moduleContent = renderEssayContent(modules[c.module].content, modules)
                            for (i in moduleContent) {
                                result.push(moduleContent[i]);
                            }
                            break;
                        default:
                            console.log("Unrecognized type: " + c.type);
                    }
                }
                return result;
            }

            var loadState = "loading";
            var errorMessage = "";

            session.onAuthChanged((state, userMeta) => {
                if (state) {
                    let req = window.location.origin + "/api/essays/essay/${req.params.user}/${encodeURIComponent(req.params.name)}/data";
                    httpGetAsync(req, (res, err) => {
                        if (!err) {
                            essayData = JSON.parse(res);
                            console.log(essayData);
                            let editor = document.getElementById("editor-main");
                            let editorContent = renderEssayContent(essayData.content, essayData.modules)
                            for (i in editorContent) {
                                editor.append(editorContent[i]);
                            }
                            window.onkeydown = (e) => {
                                console.log(e);
                            };
                            document.getElementById("authorized").style.display = "block";
                            document.getElementById("unauthorized").style.display = "none";
                        } else {
                            console.error(res);
                            document.getElementById("authorized").style.display = "none";
                            document.getElementById("unauthorized").style.display = "block";
                        }
                    });
                } else {
                    loadState = "unauthorized";
                    errorMessage = "No authentication";
                }
            });
        </script>`,
        modules.topNav +
        `<div id="authorized" style="display: none;">
            <div id="editor" style="background-color: #ffcc66">
                <ul id="editor-tools" style="margin: 0; background-color: #fafafa">
                    <li>Font Size: </li>
                </ul>
                <div id="editor-main" style="width: 90vw; height: 127.285714vw; margin: auto; background-color: #fdfdfd">
                </div>
            </div>
        </div>
        <div id="unauthorized" style="display: none">
            Not authorized for this essay.
        </div>`
    ));
};