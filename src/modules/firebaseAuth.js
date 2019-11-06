module.exports = `<script src="https://www.gstatic.com/firebasejs/6.5.0/firebase-auth.js"></script>
    <script>
        var currentUser = undefined;

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                console.log("User signed in.");
            } else {
                currentUser = undefined;
                console.log("User signed out.");
            }
        });

        function signIn() {
            firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).then((result) => {
                console.log("User successfully signed in.");
            }).catch((err) => {
                console.error(err.code, err.message);
            });
        }
    </script>
`;