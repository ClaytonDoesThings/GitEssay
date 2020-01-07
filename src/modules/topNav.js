module.exports = `
    <ul id="top-nav">
        <li><a href="/w/home">Home</a></li>
        <li><a href="/w/essays/browse">Essays</a></li>
        <li><a href="/w/courses/browse">Courses</a></li>
        <li id="user-elem" style="display: none">
            <a id="signed-out" href="javascript:session.signIn()" style="display: none;">Sign In</a>
            <div id="signed-in" style="display: none;">
                <a id="user-name" href="javascript:toggleUserDropdown()">None</a>
                <ul id="user-dropdown" style="display: none">
                    <li><a href="javascript:toProfile()">Profile</a></li>
                    <li><a href="javascript:session.signOut()">Sign Out</a></li>
                </ul>
            </div>
        </li>
    </ul>
    <script>
        if (typeof(session) !== "undefined") {
            session.onAuthChanged((state, userMeta) => {
                if (state) {
                    document.getElementById("user-name").innerText = userMeta.displayName;
                    document.getElementById("signed-in").style.display = "inline";
                    document.getElementById("signed-out").style.display = "none";
                } else {
                    document.getElementById("signed-in").style.display = "none";
                    document.getElementById("signed-out").style.display = "inline";
                }
                document.getElementById("user-elem").style.display = "list-item";
            });
        }

        function toggleUserDropdown(visible) {
            var dropdown = document.getElementById("user-dropdown");
            dropdown.style.display = (typeof(visible) === "boolean" ? visible : dropdown.style.display === "none") ? "inline" : "none";
        }

        function toProfile() {
            window.location.href = window.location.origin + "/w/profile/" + session.data.userMeta.uid;
        }
    </script>
`;