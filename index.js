const express = require('express');
const session = require('express-session');
var sessionFileStore = require('session-file-store')(session);
const app = express();
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

app.get('/favicon.ico', (req, res) => {res.sendFile(__dirname + "/src/modules/favicon.ico");});
app.get('/styles.css', (req, res) => {res.sendFile(__dirname + "/src/modules/styles.css");});

app.get('/', w.home);
app.get('/w/', w.home);
app.get('/w/home', w.home);

app.get('/w/profile/:user', w.profile);

app.get('/w/essays', w.essays.essays);

app.get('/w/essays/essay/:user/:name', w.essays.essay.view);
app.get('/w/essays/essay/:user/:name/view', w.essays.essay.view);
app.get('/w/essays/essay/:user/:name/edit', w.essays.essay.edit);

app.get('/api/session', api.session);
app.get('/api/auth/githubcallback', api.auth.githubCallback);
app.get('/api/auth/signOut', api.auth.signOut);

app.get('/api/user/:user/meta', api.user.meta);
app.get('/api/user/:user/essays', api.user.essays);

app.get('/api/essays/new', api.essays.new);

app.get('/api/essays/essay/:user/:name/meta', api.essays.essay.meta);
app.get('/api/essays/essay/:user/:name/data', api.essays.essay.data);
app.get('/api/essays/essay/:user/:name/data.json', api.essays.essay.dataJSON);
app.get('/api/essays/essay/:user/:name/delete', api.essays.essay.delete);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});