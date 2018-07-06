'use strict';

const Discord = require('discord.js'),
  auth = require('./config.js');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(auth.Discord);
console.log(client);

if (process.env.SERVE) {
  const express = require('express');
  const ex = express();

  // ex.use(bodyParser.json());
  ex.post('/', () => {
    return client;
  });
  let port = process.env.PORT || 3001;
  ex.listen(port, () => {
    if (!process.env.SILENT) console.log('Spell Book is open on port ' + port);
  });
}
