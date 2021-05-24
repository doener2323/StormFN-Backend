const express = require('express');
const app = express();

app.get('/socialban/api/public/v1/:any', (req, res) => {
    res.status(204).end();
});

module.exports = app;