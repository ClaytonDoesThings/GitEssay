module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        res.send({
            title: req.params.name
        });
    } else {
        res.status(400).send("Not authorized.");
    }
};