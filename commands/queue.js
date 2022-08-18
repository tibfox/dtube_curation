const currentDir = "/home/automations/bots/dtube_curation/discord_js/";
var config = require(currentDir + 'config.js');
const { getCurrentQueue } = require(currentDir + 'queries.json');
var curationConfig = require(currentDir + 'curationConfig.js');

const javalon = require('javalon');
const { count } = require('console');

module.exports = {
    name: 'queue',
    aliases: ['queueCount', 'q'],
    description: 'This command will query the queue of waiting unexecuted curations.\n' +
        'We do not execute curations when the VT of our account gets below the defined min VT  balance.\n' +
        'Also there is a maximum unexecuted curations defined for each curation account to prevent draining the curation account too much.',
    args: false,
    argsCount: 0,
    execute(message, args, pool) {
        doWork(message, pool);
    }
}

async function doWork(message, pool) {
    responseFields = [];
    for (const curationAccount in curationConfig.accounts) {
        let sqlGetCurrentQueue = getCurrentQueue.replace();
        responseFields = [];
        pool.query(sqlGetCurrentQueue, function (err, result, fields) {
            if (err) throw err;
            if (result.length > 0) {
                const countCurations = result[0]["result"];
                responseFields.push({ name: curationConfig.accounts[curationAccount].name, value: countCurations, inline: true });
            } else {                
                responseFields.push({ name: curationConfig.accounts[curationAccount].name, value: '0', inline: true });
            }
            if(responseFields.length == curationConfig.accounts.length){
                sendResponse(responseFields, message);
            }
        });
    }
   
    
}

function sendResponse(responseFields, message){
    message.channel.send({
        embed: {
            color: 2067276,
            title: "Curation Queue",
            description: "Here you can find the current unexecuted and waiting curations.",
            fields: responseFields
        }
    });
}