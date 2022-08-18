const currentDir = "/home/automations/bots/dtube_curation/discord_js/";
var config = require(currentDir + 'config.js');
var curationConfig = require(currentDir + 'curationConfig.js');
const mysql = require('mysql2');

module.exports = {
    name: 'vt',
    aliases: ['votingtoken', 'voting', 'vp'],
    description: 'With this command you can query the current voting tokens and minimum VT balance for our curation accounts.',
    args: false,
    argsCount: 0,
    execute(message, args) {
        getVPOfAllAccounts(message);
    }
};

async function getVPOfAllAccounts(message) {
    responseFields = [];
    for (const curationAccount in curationConfig.accounts) {
        accData = await getVTDTube(curationConfig.accounts[curationAccount].name);
        vt = accData["vt"]["v"];
        vpTs = accData["vt"]["t"];
        currentTs = Math.floor(Date.now());
        balance = accData["balance"] / 100;
        var diff = (vpTs - currentTs) / 1000;
        diff /= 3600;
        diff = Math.abs(diff);
        currentVT = vt + (balance * diff);
        resultString = '**current:** ' + (currentVT/1000).toFixed(2) + 'K VT\n**minimum:** ' + (curationConfig.accounts[curationAccount].minVTBalance/1000).toString()+ 'K VT';
        responseFields.push({ name: curationConfig.accounts[curationAccount].name , value: resultString, inline: true });
    }
    if(responseFields.length == curationConfig.accounts.length){
        sendResponse(responseFields, message);
    }
}

async function getVTDTube(username, message) {
    var request = require('request');

    let url = config.avalon.node + "/account/" + username;

    return new Promise(resolve => {
        request({
            url: url,
            method: "GET",
            headers: {},
            json: true
        }, function (error, response, body) {
            if (!error)
                resolve(body);
        })
    });
}

function sendResponse(responseFields, message){
    message.channel.send({
        embed: {
            color: 2067276,
            title: "Voting Token overview",
            description: "Here you can find the current VT balance and the minimum VT of our curation accounts. If the current VT < minimum VT your curation will get saved for later.",
            fields: responseFields
        }
    });
}