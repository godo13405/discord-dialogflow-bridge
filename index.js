'use strict';
const Discord = require('discord.js'),
  projectId = 'dnd-wiki-ca7bd',
  sessionId = 'quickstart-session-id',
  languageCode = 'en',
	fs = require('fs');

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const enigma = require('./enigma');

// let temp = JSON.stringify({
// 	dialogflow: "1e8cb01366014799a6dd73f62be9a008",
// 	discord: "NDUxMDQyODUyODg2MTUxMTY4.DiJFhg._imDrOl5ct6lqRC5MzP4rrKXMJU"
// });
// temp = enigma.encrypt(temp);
// fs.writeFile('./config', temp);
let auth = fs.readFileSync('./config', 'utf8');
auth = enigma.decrypt(auth);

// The text query request.
const request = {
  session: sessionPath,
  source: 'discord',
  queryInput: {
    text: {
      text: 'hi',
      languageCode: languageCode,
    },
  },
};

// Send request and log result
function dialogflowBridge(input, self) {
  if (typeof input === 'string') {
    request.queryInput.text.text = input;
    input = request;
  }
  return sessionClient
    .detectIntent(input)
    .then(response => {
      return response;
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

const client = new Discord.Client();

client.on('ready', () => {
	client.user.setUsername("Dragon Book");
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let mention = (msg.author.id !== client.user.id && msg.channel.type === 'dm') || Boolean(msg.content.indexOf(`<@${client.user.id}>`) >= 0);
  if (mention) {
		msg.content = msg.content.replace(/<@[0-9]*>/gi, '');
		console.log('User asks: ', msg.content);
    let output = dialogflowBridge(msg.content);
    output.then(x => {
			if (!x || !x.length) {
				x = 'I can\'t find my magic book right now... Please try again later.';
			}
      console.log('Dragon says: ', x[0].queryResult.fulfillmentText);
      return msg.reply(x[0].queryResult.fulfillmentText);
    });
  }
});

// client.login(auth.Discord);
