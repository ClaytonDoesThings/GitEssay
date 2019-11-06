module.exports = (req, res) => {
    authenticate(req.query.token, [req.params.user]).then(() => {
        res.send({
            title: req.params.name
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
};