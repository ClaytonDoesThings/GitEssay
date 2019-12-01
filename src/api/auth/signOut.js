module.exports = (req, res) => {
    req.session.auth = false;
    req.session.userMeta = undefined;
    res.send("Signed Out.");
};