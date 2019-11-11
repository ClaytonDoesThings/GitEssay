const express = require('express');
const app = express();
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

app.get('/w/new', w.new);

app.get('/w/repo/:user/:name', w.repoUserName.view);
app.get('/w/repo/:user/:name/view', w.repoUserName.view);
app.get('/w/repo/:user/:name/edit', w.repoUserName.edit);

app.get('/api/user/:user/meta', api.userMeta);
app.get('/api/user/:user/repos', api.userRepos);

app.get('/api/new', api.new);

app.get('/api/repo/:user/:name/meta', api.repoUserName.meta);
app.get('/api/repo/:user/:name/data', api.repoUserName.data);
app.get('/api/repo/:user/:name/data.json', api.repoUserName.dataJSON);
app.get('/api/repo/:user/:name/delete', api.repoUserName.delete);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});