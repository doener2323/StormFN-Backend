const express = require('express');
const app = express();
const axios = require("axios");

app.get(['/fortnite/api/v2/versioncheck/:ver', '/fortnite/api/versioncheck/:ver'], (req, res) => {
	res.json({
		type: 'NO_UPDATE',
	});
});

app.get('/fortnite/api/game/v2/enabled_features', (req, res) => {
    res.json([]);
});

app.get('/fortnite/api/calendar/v1/timeline', async (req, res) => {
    axios.get('https://api.nitestats.com/v1/epic/modes').then(response => {
        res.json(response.data)
    }).catch(e => {
        res.json({'channels':{'client-events':{'states':[{'state':{'seasonNumber':0,'seasonTemplateId':'AthenaSeason:athenaseason0','seasonBegin':'0001-06-23T04:00:00Z','seasonEnd':'0001-07-23T04:00:00Z','seasonDisplayedEnd':'0001-07-23T04:00:00Z'}}]}},'currentTime': new Date()})
    })
            
})

module.exports = app;
