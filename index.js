const Discord = require('discord.js');
const fs = require('fs');
// get the client
const mysql2 = require('mysql2');


const currentDir = "/home/automations/bots/dtube_curation/discord_js/"
var config = require( currentDir + 'config.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(currentDir + '/commands').filter(file => file.endsWith('.js'));

var db_config = {
  host: "localhost",
  user: config.mysql.user,
  password: config.mysql.pw,
  database: config.mysql.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql2.createPool(db_config);

for (const file of commandFiles) {

  const command = require(currentDir + '/commands/' + file);

  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  

});



client.on('message', message => {
  if (! config.discord.channels.includes(message.channel.id) // somehow it doesnt work with "curation" wtf?!
    || !message.content.startsWith(config.discord.prefix)
    || message.author.bot) return;

  const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) {
    message.channel.send("command " + commandName +" not found")
    return;
  }

  if (command.args && (!args.length || args.length < command.argsCount)) {

    let reply = `You didn't provide all arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${config.discord.prefix}${commandName} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  try {
    command.execute(message, args, pool);

  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }


}
);

client.login(config.discord.token);