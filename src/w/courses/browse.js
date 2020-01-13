const modules = require('../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.httpGetAsync +
        modules.session +
        modules.styles +
        `<script>
            session.onAuthChanged((state, userMeta) => {
                let signedOut = document.getElementById("signedOut");
                let signedIn = document.getElementById("signedIn");
                let signedInUser = document.getElementById("signedInUser");
    
                if (state) {
                    signedOut.style.display = "none";
                    signedIn.style.display = "block";
                } else {
                    signedOut.style.display = "block";
                    signedIn.style.display = "none";
                }
            });
            
            function newCourse() {
                var courseName = document.getElementById("courseName").value;
                if (courseName.length > 0 && session.data.auth) {
                    let encodedName = encodeURIComponent(courseName);
                    let req = window.location.origin + "/api/courses/new?course=" + encodedName;
                    httpGetAsync(req, (res, err) => {
                        if (!err) {
                            document.getElementById("errorBox").innerText = "";
                            window.location.href = ("/w/courses/course/" + session.data.userMeta.uid + "/" + encodedName);
                        } else {
                            console.error(res);
                            document.getElementById("errorBox").innerText = res;
                        }
                    });
                }
            }
        </script>`,
        modules.topNav +
        `
            <h1>Courses</h1>
            <div id="signedOut" style="display: none">
                <input type="button" value="Sign In To Continue" onClick="session.signIn()"/>
            </div>
            <div id="signedIn" style="display: none">
                <div>
                    Course Name: <input type="text" value="" id="courseName"/>
                    <input type="button" value="New Course" onClick="newCourse()"/><br/>
                    <script>
                        document.getElementById("courseName").addEventListener("keyup", function (event) {
                            if (event.keyCode === 13) {
                                event.preventDefault();
                                newCourse();
                            }
                        });
                    </script>
                    <p id="errorBox" style="color: red"></p>
                </div>
            </div>
        `
    ));
};