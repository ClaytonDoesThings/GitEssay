const githubAuthURL = require('../config/githubAuth').authURL;

module.exports = `<script>
    var session = {
        windowLoaded: false,
        data: {},
        _onAuthChanged: [],
        onAuthChanged: (listener) => {
            if (session.windowLoaded && session.data !== {}) {
                listener(session.data.auth, session.data.userMeta);
            }
            session._onAuthChanged.push(listener);
        },
        signIn: () => {
            session.signInWindow = window.open("${githubAuthURL}");
            session.checkLoop = setInterval(() => {
                if (session.signInWindow.closed) {
                    clearInterval(session.checkLoop);
                    session.updateSession();
                }
            }, 10);
        },
        signOut: () => {
            httpGetAsync(window.location.origin + "/api/auth/signOut", (res, err) => {
                if (!err) {
                    session.updateSession();
                } else {
                    console.error(res);
                }
            })
        },
        updateSession: () => {
            httpGetAsync(window.location.origin + "/api/session", (res, err) => {
                if (!err) {
                    res = JSON.parse(res);
                    if (session.data.auth !== res.auth) {
                        for (let i in session._onAuthChanged) {
                            session._onAuthChanged[i](res.auth, res.userMeta);
                        }
                    }
                    session.data = res;
                } else {
                    console.error(res);
                }
            });
        }
    };
    window.addEventListener("load", () => {
        session.windowLoaded = true;
        session.updateSession();
        setInterval(session.updateSession, 60000);
    });
</script>`;