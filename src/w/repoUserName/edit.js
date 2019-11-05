modules = require('../../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.firebase +
        modules.firebaseAuth +
        modules.httpGetAsync +
        `<script>
            var loadState = "loading";
            var errorMessage = "";

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    currentUser.getIdToken(true).then((idToken) => {
                        let req = window.location.origin + "/api/repo/${req.params.user}/${req.params.name}/data?token=" + idToken;
                        httpGetAsync(req, (res, err) => {
                            if (!err) {
                                console.log(JSON.parse(res));
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
        </script>`,
        ``
    ));
};