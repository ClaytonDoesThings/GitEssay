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
                    if (user.uid === window.location.pathname.split("/")[3]) {
                        document.getElementById("delete-modal-button").style.display = "inline";
                    }

                    user.getIdToken(true).then((idToken) => {
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

            function openDeleteModal() {
                document.getElementById("delete-modal").style.display = "block";
            }

            function closeDeleteModal() {
                document.getElementById("delete-modal").style.display = "none";
            }

            window.onclick = function(event) {
                let deleteModal = document.getElementById("delete-modal")
                if (event.target == deleteModal) {
                    deleteModal.style.display = "none";
                }
            }

            function onDeleteInputUpdate(e) {
                let input = e.target.value.split("/");
                document.getElementById("delete-button").disabled = !(input.length === 2 && input[0] === "${req.params.user}" && input[1] === "${req.params.name}");
            }

            function deleteEssay() {
                firebase.auth().currentUser.getIdToken(true).then((idToken) => {
                    let req = (window.location.origin + "/api/repo/${req.params.user}/${req.params.name}/delete?token=" + idToken);
                    httpGetAsync(req, (res, err) => {
                        if (!err) {
                            console.log("Repo successfully deleted");
                            window.location.href = (window.location.origin + "/w/profile/${req.params.user}");
                        } else {
                            console.error(res);
                        }
                    });
                });
            }

            function onLoad() {
                document.getElementById("delete-input").addEventListener('input', onDeleteInputUpdate);
            }
        </script>`,
        modules.topNav +
        `<div id="loaded" style="display: none;">
            <h1 id="title">No Title</h1>
            <a href="/w/repo/${req.params.user}/${req.params.name}/edit">Edit</a>
            <a href="javascript:download()">Download</a>
            <a href="javascript:openDeleteModal()" id="delete-modal-button" style="display: none">Delete</a>
        </div>
        <div id="delete-modal" class="modal">
            <div class="modal-content">
                <span class="modal-close-button" onclick="closeDeleteModal()">&times;</span>
                <span>Are you sure you want to delete this essay?</span><br/>
                <span>Please enter the your UID followed by slash and the essay ID.</span><br/>
                <input type="text" id="delete-input" style="width: 90%" placeholder="ex: 04eQTVGatATNtKTdE53RipyPI7R2/wacc-essay"/>
                <input type="button" style="width: 9%" value="Delete" onclick="deleteEssay()" id="delete-button" disabled>
            </div>
        </div>`,
        ``,
        `onload="onLoad()"`
    ));
};