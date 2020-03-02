const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const session = require('express-session');
var sessionFileStore = require('session-file-store')(session);
app.use(session({
    secret: 'I got a wacc attacc',
    resave: true,
    saveUninitialized: false,
    store: new sessionFileStore({
        ttl: 604800
    }),
    cookie: {maxAge: 604800000}
}));
const port = process.env.PORT || 8080;

const modules = require('./src/modules');
const w = require('./src/w');
const api = require('./src/api');
const config = require('./src/config');

// Meta
app.get('/favicon.ico', (req, res) => {res.sendFile(__dirname + "/src/modules/favicon.ico");});
app.get('/styles.css', (req, res) => {res.sendFile(__dirname + "/src/modules/styles.css");});

// Home
app.get(
    [
        '/',
        '/w/',
        '/w/home'
    ],
    w.home
);

// Auth API
app.get('/api/session', api.session);
app.get('/api/auth/githubcallback', api.auth.githubCallback);
app.get('/api/auth/signOut', api.auth.signOut);

// User Pages
app.get('/w/profile/:user', w.profile);

// User API
app.get('/api/user/:user/meta', api.user.meta);
app.get('/api/user/:user/essays', api.user.essays);
app.get('/api/user/:user/courses', api.user.courses);

// Essay Pages
app.get(
    [
        '/w/essays',
        '/w/essays/browse'
    ],
    w.essays.browse
);

app.get(
    [
        '/w/essays/essay/:user/:name',
        '/w/essays/essay/:user/:name/view'
    ],
    w.essays.essay.view
);
app.get('/w/essays/essay/:user/:name/edit', w.essays.essay.edit);

// Essay API
app.get('/api/essays/new', api.essays.new);

app.get('/api/essays/essay/:user/:name/meta', api.essays.essay.meta);
app.get('/api/essays/essay/:user/:name/data', api.essays.essay.data);
app.get('/api/essays/essay/:user/:name/data.json', api.essays.essay.dataJSON);
app.get('/api/essays/essay/:user/:name/delete', api.essays.essay.delete);

// Course Pages
app.get(
    [
        '/w/courses',
        '/w/courses/browse'
    ],
    w.courses.browse
);
app.get('/w/courses/course/:user/:name/terms', w.courses.course.terms.browse);

app.get(
    [
        '/w/courses/course/:user/:name',
        '/w/courses/course/:user/:name/view'
    ], w.courses.course.view
);

// Course API
app.get('/api/courses/new', api.courses.new);

app.get('/api/courses/course/:user/:course/meta', api.courses.course.meta);
app.get('/api/courses/course/:user/:course/delete', api.courses.course.delete);

app.get('/api/courses/course/:user/:course/terms', api.courses.course.terms.terms);
app.post('/api/courses/course/:user/:course/terms', api.courses.course.terms.new);

app.use(w["404"]);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});