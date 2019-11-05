const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const modules = require('./src/modules');
const w = require('./src/w');
const api = require('./src/api');
const config = require('./src/config');

app.get('/w/new', w.new);

app.get('/w/repo/:user/:name', w.repoUserName);

app.get('/api/new', api.new);

app.get('/api/repo/:user/:name', api.repoUserName);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});