modules = require('../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.httpGetAsync +
        modules.session +
        modules.styles +
        `<script>
            function requestEssays() {
                let req = window.location.origin + "/api/user/${req.params.user}/essays";
                httpGetAsync(req, (res, err) => {
                    if (!err) {
                        res = JSON.parse(res);
                        console.log(res);
                        var essaysString = "";
                        if (res.length > 0) {
                            for (i in res) {
                                essaysString += "<li><a href=\\"/w/essays/essay/${req.params.user}/\" + res[i] + "\\">" + decodeURIComponent(res[i]) + "</li>";
                            }
                        } else {
                            essaysString = "None of this user's essays are visible to you.";
                        }
                        document.getElementById("essays-ul").innerHTML = essaysString;
                        document.getElementById("essays").style.display = "block";
                    } else {
                        console.error(res);
                    }
                });
            }
            
            function requestCourses() {
                let req = window.location.origin + "/api/user/${req.params.user}/courses";
                httpGetAsync(req, (res, err) => {
                    if (!err) {
                        res = JSON.parse(res);
                        console.log(res);
                        var coursesString = "";
                        if (res.length > 0) {
                            for (i in res) {
                                coursesString += "<li><a href=\\"/w/courses/course/${req.params.user}/\" + res[i] + "\\">" + decodeURIComponent(res[i]) + "</li>";
                            }
                        } else {
                            coursesString = "None of this user's courses are visible to you.";
                        }
                        document.getElementById("courses-ul").innerHTML = coursesString;
                        document.getElementById("courses").style.display = "block";
                    } else {
                        console.error(res);
                    }
                });
            }

            var req = window.location.origin + "/api/user/${req.params.user}/meta";
            httpGetAsync(req, (res, err) => {
                if (!err) {
                    res = JSON.parse(res);
                    let nameElm = document.getElementById("display-name");
                    nameElm.innerText = res.displayName;
                    nameElm.style.display = "inline";
                } else {
                    console.error(res);
                }
            });

            session.onAuthChanged((state, userMeta) => {
                requestEssays();
                requestCourses();
            });
        </script>`,
        modules.topNav +
        `
            <h1 id="display-name" style="display: none">displayName</h1>
            <div id="essays">
                <h2>Essays:</h2>
                <ul id="essays-ul">
                </ul>
            </div>
            <div id="courses">
                <h2>Courses:</h2>
                <ul id="courses-ul">
                </ul>
            </div>
        `
    ));
}