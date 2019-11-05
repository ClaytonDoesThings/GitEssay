modules = require('../modules')

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.firebase +
        modules.firebaseAuth +
        modules.httpGetAsync +
        modules.topNav +
        `<script>
            firebase.auth().onAuthStateChanged((user) => {
                let signedOut = document.getElementById("signedOut");
                let signedIn = document.getElementById("signedIn");
                let signedInUser = document.getElementById("signedInUser");
    
                if (user) {
                    signedOut.style.display = "none";
                    signedIn.style.display = "block";
                    signedInUser.innerText = "Signed in as: " + user.displayName;
                } else {
                    signedOut.style.display = "block";
                    signedIn.style.display = "none";
                }
            });
            
            function newEssay() {
                var essayName = document.getElementById("essayName").value;
                if (essayName.length > 0 && firebase.auth().currentUser) {
                    currentUser.getIdToken(true).then((idToken) => {
                        let req = window.location.origin + "/api/new?token=" + idToken + "&name=" + essayName;
                        httpGetAsync(req, (res, err) => {
                            if (!err) {
                                document.getElementById("errorBox").innerText = "";
                                window.location.href = ("/w/repo/" + currentUser.uid + "/" + essayName);
                            } else {
                                console.error(res);
                                document.getElementById("errorBox").innerText = res;
                            }
                        });
                    });
                }
            }
        </script>`,
        `
            <div id="signedOut">
                <input type="button" value="Sign In" onClick="signIn()"/>
            </div>
            <div id="signedIn" style="display: none">
                <input type="button" value="Sign Out" onClick="firebase.auth().signOut()"/>
                <span id="signedInUser">Signed in as: ???</span>
                <div>
                    Essay Name: <input type="text" value="" id="essayName"/>
                    <input type="button" value="New Essay" onClick="newEssay()"/><br/>
                    <p id="errorBox" style="color: red"></p>
                </div>
            </div>
        `
    ));
}