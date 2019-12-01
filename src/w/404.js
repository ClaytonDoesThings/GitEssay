const modules = require('../modules');

module.exports = (req, res, next) => {
    res.send(modules.htmlPage(
        modules.styles,
        modules.topNav +
        `
            <h1>404</h1>
            <p>2#!7! The page you requested does not exist. If you were given a link, please contact the referer about the error.</p>
            <a href="/w/home">Take me back home.</a> 
        `
    ));
};