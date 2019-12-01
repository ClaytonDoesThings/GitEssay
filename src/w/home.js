modules = require('../modules');

module.exports = (req, res) => {
    res.send(modules.htmlPage(
        modules.styles +
        modules.httpGetAsync +
        modules.session,
        modules.topNav +
        `
            <h1>Home</h1>
        `
    ));
};