modules = require('../../../modules');

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

                            document.getElementById("title").innerText = meta.title;
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
                document.getElementById("delete-button").disabled = !(input.length === 2 && input[0] === "${req.params.user}" && input[1] === "${encodeURIComponent(req.params.name)}");
            }

            function deleteCourse() {
                let req = (window.location.origin + "/api/courses/course/${req.params.user}/${encodeURIComponent(req.params.name)}/delete");
                httpGetAsync(req, (res, err) => {
                    if (!err) {
                        console.log("Repo successfully deleted");
                        window.location.href = (window.location.origin + "/w/profile/${req.params.user}");
                    } else {
                        console.error(res);
                    }
                });
            }

            function onLoad() {
                document.getElementById("delete-input").addEventListener('input', onDeleteInputUpdate);
            }
        </script>`,
        modules.topNav +
        `<div id="loaded" style="display: none;">
            <h1 id="title">No Title</h1>
            <div>
                <a href="/w/courses/course/${req.params.user}/${encodeURIComponent(req.params.name)}/terms">Terms</a>
            <div>
            <a href="/api/courses/course/${req.params.user}/${encodeURIComponent(req.params.name)}/data.json">Download</a>
            <a href="javascript:openDeleteModal()" id="delete-modal-button">Delete</a>
        </div>
        </div>
        <div id="delete-modal" class="modal">
            <div class="modal-content">
                <span class="modal-close-button" onclick="closeDeleteModal()">&times;</span>
                <span>Are you sure you want to delete this course?</span><br/>
                <span>Please enter the your UID followed by slash and the course name.</span><br/>
                <input type="text" id="delete-input" style="width: 90%" placeholder="ex: GitHub-MDQ6VXNlcjE2OTgxMjgz/wacc-course"/>
                <input type="button" style="width: 9%" value="Delete" onclick="deleteCourse()" id="delete-button" disabled>
            </div>
        </div>`,
        ``,
        `onload="onLoad()"`
    ));
};