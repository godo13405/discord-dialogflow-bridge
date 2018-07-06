'use strict';

const Discord = require('discord.io'),
	config = require('./config.js');

const bot = new Discord.Client({
    token: config.Discord,
    autorun: true
});

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
});


if (process.env.SERVE) {
	const express = require('express');
	const ex = express();

	// ex.use(bodyParser.json());
	ex.post('/', () => {
		return bot;
	});
	let port = process.env.PORT || 3001;
	ex.listen(port, () => {
	  if (!process.env.SILENT) console.log('Spell Book is open on port '+port);
	});
}
