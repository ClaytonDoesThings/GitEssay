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
            
            function newEssay() {
                var essayName = document.getElementById("essayName").value;
                if (essayName.length > 0 && session.data.auth) {
                    let encodedName = encodeURIComponent(essayName);
                    let req = window.location.origin + "/api/essays/new?name=" + encodedName;
                    httpGetAsync(req, (res, err) => {
                        if (!err) {
                            document.getElementById("errorBox").innerText = "";
                            window.location.href = ("/w/essays/essay/" + session.data.userMeta.uid + "/" + encodedName);
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
            <h1>Essays</h1>
            <div id="signedOut" style="display: none">
                <input type="button" value="Sign In To Continue" onClick="session.signIn()"/>
            </div>
            <div id="signedIn" style="display: none">
                <div>
                    Essay Name: <input type="text" value="" id="essayName"/>
                    <input type="button" value="New Essay" onClick="newEssay()"/><br/>
                    <script>
                        document.getElementById("essayName").addEventListener("keyup", function (event) {
                            if (event.keyCode === 13) {
                                event.preventDefault();
                                newEssay();
                            }
                        });
                    </script>
                    <p id="errorBox" style="color: red"></p>
                </div>
            </div>
        `
    ));
};