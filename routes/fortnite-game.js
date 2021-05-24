const express = require('express')
const app = express()
const config = require('../config');
const axios = require('axios');

app.get('/content/api/pages/fortnite-game', async (req, res) => {

    const data = await axios.get('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game');
    const banner = config.banner;
    const background = config.background;

    var response = {
        'jcr:isCheckedOut': data.data['jcr:isCheckedOut'] || true,
        _title: 'Fortnite Game',
        'jcr:baseVersion': data.data['jcr:baseVersion'] || 'a7ca237317f1e7883b3279-c38f-4aa7-a325-e099e4bf71e5',
        _activeDate: data.data._activeDate || '2017-08-30T03:20:48.050Z',
        lastModified: data.data.lastModified || new Date().toISOString(),
        _locale: data.data._locale || 'en'
    };

    response.emergencynoticev2 = {
        'jcr:isCheckedOut': data.data.emergencynoticev2['jcr:isCheckedOut'] || true,
        _title: data.data.emergencynoticev2._title || 'emergencynoticev2',
        _noIndex: data.data.emergencynoticev2._noIndex || false,
        'jcr:baseVersion': data.data.emergencynoticev2['jcr:baseVersion'] || 'a7ca237317f1e7da533b38-74ee-468b-8c63-a7c3c256b313',
        emergencyNotices: {
            _type: data.data.emergencynoticev2.emergencynotices._type || 'Emergency Notices',
            emergencynotices: [
                {
                    hidden: false,
                    _type: 'CommonUI Emergency Notice Base',
                    title: 'Storm',
                    body: 'Storm is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Epic Games.',
                }
            ]
        },
        _activeDate: data.data.emergencynoticev2._activeDate || '2018-08-06T19:00:26.217Z',
        lastModified: data.data.emergencynoticev2.lastModified || '2021-05-10T19:37:21.335Z',
        _locale: data.data.emergencynoticev2._locale || 'en-US',
    }

    response.subscription = data.data.subscription;
    response.shopSections = data.data.shopSections;

    response.battleroyalenewsv2 = {
        news: {
            motds: [{
                entryType: 'Website',
                image: banner,
                tileImage: banner,
                videoMute: false,
                hidden: false,
                tabTitleOverride: 'Storm',
                _type: 'CommonUI Simple Message MOTD',
                title: 'Storm',
                body: 'Welcome to Storm',
                videoLoop: false,
                videoStreamingEnabled: false,
                sortingPriority: 0,
                id: 'StormNewsBRv2',
                videoAutoplay: false,
                videoFullscreen: false,
                spotlight: false,
                websiteURL: 'https://discord.gg/stormfn',
                websiteButtonText: 'Join the Discord'
            }]
        },
        'jcr:isCheckedOut': data.data.battleroyalenewsv2['jcr:isCheckedOut'] || true,
        _title: 'battleroyalenews',
        _noIndex: false,
        alwaysShow: false,
        'jcr:baseVersion': data.data.battleroyalenewsv2['jcr:baseVersion'] || 'a7ca237317f1e7546d8fe7-0d7a-4312-9e37-a20f1c4333b0',
        _activeDate: data.data.battleroyalenewsv2._activeDate || '2020-01-21T14:00:00.000Z',
        lastModified: data.data.battleroyalenewsv2.lastModified || new Date().toISOString(),
        _locale: data.data._locale || 'en-US'
    };

    response.dynamicbackgrounds = {
        'jcr:isCheckedOut': data.data.dynamicbackgrounds['jcr:isCheckedOut'] || true,
        backgrounds: {
            backgrounds: [
                {
                    stage: background,
                    _type: 'DynamicBackground',
                    key: 'lobby'
                },
                {
                    stage: background,
                    _type: 'DynamicBackground',
                    key: 'vault'
                }
            ],
            _type: 'DynamicBackgroundList'
        },
        _title: 'dynamicbackgrounds',
        _noIndex: false,
        'jcr:baseVersion': data.data.dynamicbackgrounds['jcr:baseVersion'] || 'a7ca237317f1e7546d8fe7-0d7a-4312-9e37-a20f1c4333b0',
        _activeDate: data.data.battleroyalenewsv2._activeDate || '2020-01-21T14:00:00.000Z',
        lastModified: data.data.battleroyalenewsv2.lastModified || new Date().toISOString(),
        _locale: data.data._locale || 'en-US'
    };

    res.json(data.data);
})

module.exports = app