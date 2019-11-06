modules = require('../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.firebase +
        modules.firebaseAuth +
        modules.styles +
        `
        `,
        modules.topNav +
        `
            <h1>Home</h1>
        `
    ));
};