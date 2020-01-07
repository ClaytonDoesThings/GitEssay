const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.session.auth && req.session.uid == req.params.user) {
        var setData;
        try {
            
        } catch (e) {
            console.error(e);
            if (typeof(e) === "string") {
                res.status(400).send(e);
                return;
            }
            termData = false;
        }
    } else {
        res.status(400).send("Not authorized.");
    }
};