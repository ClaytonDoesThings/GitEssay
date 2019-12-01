if (!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)) {
    console.error("No GitHub ID/Secret passed through. Exiting...");
    process.exit(1);
}

module.exports = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    authURL: "https://github.com/login/oauth/authorize?client_id=" + process.env.GITHUB_CLIENT_ID
};