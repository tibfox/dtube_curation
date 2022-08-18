const https = require('https');

const { link } = require('fs');

const currentDir = "/home/automations/bots/dtube_curation/discord_js/";
var config = require( currentDir + 'config.js');

const { insertFeedback } = require(currentDir + 'queries.json');

const mysql = require('mysql2');

async function feedbackPost(message, args, pool) {
    const javalon = require('javalon');

    DTubeLink = args[0];
    feedbackList = args;
    feedbackList.shift();
    feedback = feedbackList.join(' ');
    
    var url = DTubeLink.split('/');
    var author = url[url.length - 2];
    var permLink = url[url.length - 1];
    await javalon.init({ api: config.avalon.node })


    await javalon.getContent(author, permLink, (err, content) => {
        if (content) {
         let sqlInsertFeedback = insertFeedback
            .replace('{feedback}', feedback)
            .replace('{author}', author)
            .replace('{permlink}', permLink);
        pool.query(sqlInsertFeedback, function (err, result) {
            if (err) throw err;
            message.channel.send("thx for the feedback");
        });
        } else {
            message.channel.send("can't find the post :/\n" + err);
            return;

        }
    });
};


module.exports = {
    name: 'feedback',
    aliases: ['comment', 'reply', 'f'],
    usage: '<link> <feedback>',
    description: '\n\n**currently not supported**\n\nUse this command to send a feedback comment in the name of the curation account.\n' + 
    'Use it to give valuable feedback helping the creator to create better videos or use DTube in a better way.\n' + 
    'Please try to not get too "fancy" with the <feedback> - emojis should work though.',
    args: true, 
    argsCount: 2,
    execute( message, args, pool) {
        feedbackPost(message, args, pool);
    }
}
