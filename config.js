var config = {};
config.discord = {};
config.mysql = {};
config.avalon = {};

// discord values
config.discord.token = ""; // discord bot token
config.discord.prefix = ""; // discord bot prefix e.g. &

config.discord.channels = [ // channelids the bot should react to messages
    "000000000000000000",
];

// mysql values
config.mysql.server = "localhost"; 
config.mysql.db = "database";
config.mysql.user = "user";
config.mysql.pw = "password";

// other values
config.avalon.node = ""; // avalon api node
config.avalon.originalDtubers = ""; // original dtubers list

module.exports = config;