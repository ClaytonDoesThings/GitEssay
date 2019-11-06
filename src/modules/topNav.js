module.exports = `
    <ul id="top-nav">
        <li><a href="/w/home">Home</a></li>
        <li><a href="/w/new">New</a></li>
        <li id="user" style="display: none">
            <a id="signed-out" href="javascript:signIn()" style="display: none;">Sign In</a>
            <div id="signed-in" style="display: none;">
                <a id="user-name" href="javascript:toggleUserDropdown()">None</a>
                <ul id="user-dropdown" style="display: none">
                    <li><a href="javascript:toProfile()">Profile</a></li>
                    <li><a href="javascript:firebase.auth().signOut()">Sign Out</a></li>
                </ul>
            </div>
        </li>
    </ul>
    <script>
        if (firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    document.getElementById("user-name").innerText = user.displayName;
                    document.getElementById("signed-in").style.display = "inline";
                    document.getElementById("signed-out").style.display = "none";
                } else {
                    document.getElementById("signed-in").style.display = "none";
                    document.getElementById("signed-out").style.display = "inline";
                }
                document.getElementById("user").style.display = "list-item";
            });
        } else {
            console.log("Firebase not initialized, topNav will not render user.");
        }

        function toggleUserDropdown(visible) {
            var dropdown = document.getElementById("user-dropdown");
            dropdown.style.display = (typeof(visible) === "boolean" ? visible : dropdown.style.display === "none") ? "inline" : "none";
        }

        function toProfile() {
            window.location.href = window.location.origin + "/w/profile/" + firebase.auth().currentUser.uid;
        }
    </script>
`;