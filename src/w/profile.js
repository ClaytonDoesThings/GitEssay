modules = require('../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.firebase +
        modules.firebaseAuth +
        modules.httpGetAsync +
        modules.styles +
        `<script>
            function requestRepos(idToken) {
                let req = window.location.origin + "/api/user/${req.params.user}/repos" + (idToken ? "?token=" + idToken : "");
                httpGetAsync(req, (res, err) => {
                    if (!err) {
                        res = JSON.parse(res);
                        console.log(res);
                        var reposString = "";
                        if (res.length > 0) {
                            for (i in res) {
                                reposString += "<li><a href=\\"/w/repo/${req.params.user}/\" + res[i] + "\\">" + res[i] + "</li>";
                            }
                        } else {
                            reposString = "None of this user's repos are visible to you.";
                        }
                        document.getElementById("repos-ul").innerHTML = reposString;
                        document.getElementById("repos").style.display = "block";
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

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    currentUser.getIdToken(true).then((idToken) => {
                        requestRepos(idToken);
                    });
                } else {
                    requestRepos();
                }
            });
        </script>`,
        modules.topNav +
        `
            <h1 id="display-name" style="display: none">displayName</h1>
            <div id="repos">
                <h2>Repos:</h2>
                <ul id="repos-ul">
                </ul>
            </div>
        `
    ));
}