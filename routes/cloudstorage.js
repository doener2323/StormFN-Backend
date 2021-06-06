const express = require('express');
const app = express();
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const config = require('../config');

// INSPIRED BY AURORAFN & NEONITE
app.get('/fortnite/api/cloudstorage/system', (req, res) => {
	let result = [];
	fs.readdirSync(`${config.directory}/cache/cloudstorage`)
		.forEach((file) => {
			result.push({
				uniqueFileName: file,
				filename: file,
				hash: crypto.createHash('sha1').update(file).digest('hex'),
				hash256: crypto.createHash('sha256').update(file).digest('hex'),
				length: file.length,
				contentType: 'application/octet-stream',
				uploaded: fs.statSync(
					`${config.directory}/cache/cloudstorage/${file}`
				).mtime,
				storageType: 'S3',
				doNotCache: false,
			});
		});
	res.json(result);
});

app.get('/fortnite/api/cloudstorage/system/config', (req, res) => {
	res.send('');
});

app.get('/fortnite/api/cloudstorage/system/:fileName', (req, res) => {
	if (
		fs.existsSync(
			`${config.directory}/cache/cloudstorage/${req.params.fileName}`
		)
	) {
		res.send(
			fs.readFileSync(
				`${config.directory}/cache/cloudstorage/${req.params.fileName}`
			)
		);
	} else {
		res.status(404).end();
	}
});

module.exports = app;
