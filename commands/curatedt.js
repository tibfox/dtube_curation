const https = require('https');
const { link } = require('fs');
const currentDir = "/home/automations/bots/dtube_curation/discord_js/";
var config = require(currentDir + 'config.js');
const { insertCuration, getCurrentQueue, getIsPostCurated, getCategoriesCommands, getCurrentQueueForAccount } = require(currentDir + 'queries.json');
var curationConfig = require(currentDir + 'curationConfig.js');
const mysql2 = require('mysql2/promise');

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
const pool2 = mysql2.createPool(db_config);

module.exports = {
    name: 'curate',
    aliases: ['cur', 'curation', 'c'],
    usage: '<link> <category> <tip(optional)>',
    description: 'This command is to curate a DTube video.\n' +
        'The <category> is mandatory and should describe the video like a topic/niche. If you want to know all the categories the you can use the command &categories.\n' +
        'The <tip> is optional and can be max. 50% but please use it wisely.\nThe tip will automatically get added/boosted when the author is a original dtuber.',
    args: true,
    argsCount: 2,
    execute(message, args, pool2) {
        curatePost(message, args, pool2);
    }
}



async function curateDTube(args, message, pool) {
    const javalon = require('javalon');
    await javalon.init({ api: config.avalon.node })
    // parse curation command
    let DTubeLink = args[0];
    let category = args[1];
    let url = DTubeLink.split('/');
    let author = url[url.length - 2];
    let permLink = url[url.length - 1];
    let tip = 0;
    // if curation command includes a tip
    if (args.length > 2) {
        tip = parseInt(args[2]);
    }
    javalon.getContent(author, permLink, async (err, content) => {
        if (content) {
            let responseFields = [];
            console.log(curationConfig);
            let created = new Date(content["ts"]).toISOString();
            let postedOnDate = created.substring(0, 10);
            let postedOnTime = created.substring(11, 19);
            // do this for all accounts listed in curationConfig
            for (curationAccount in curationConfig.accounts) {
                let acc = curationConfig.accounts[curationAccount];
                // check if its already curated by the curationAccount
                let sqlAlreadyCurated = getIsPostCurated
                    .replace('{author}', author)
                    .replace('{link}', permLink)
                    .replace('{curationAccount}', acc.name);
                pool.query(sqlAlreadyCurated, async function (err, result, fields) {
                    if (err) throw err;
                    alreadyCurated = result[0]["result"];
                    if (alreadyCurated >= 1) { // if allready curated
                        responseFields.push({ name: acc.name, value: "This post already got curated!", inline: true });
                        sendResponse(message, responseFields);
                    } else {
                        // check if the curation queue is full for the curationAccount
                        let sqlCurrentQueue = getCurrentQueueForAccount.replace('{curationAccount}', acc.name);
                        pool.query(sqlCurrentQueue, async function (err, result, fields) {
                            if (err) throw err;
                            currentCount = result[0]["result"];
                            if (currentCount >= curationAccount.maxQueueCount) { // if the queue is full 
                                responseFields.push({ name: acc.name, value: "The queue of this account is full!", inline: true });
                                sendResponse(message, responseFields);
                            } else {
                                // check if author is on the original dtubers list
                                //get list of original dtubers
                                let originalDTubers_list = '';
                                await https.get(config.avalon.originalDtubers, res => {
                                    res.on('data', chunk => {
                                        originalDTubers_list += chunk;
                                    });
                                    res.on('end', async () => {
                                        originalDTubers_list = originalDTubers_list.replace(/"/g, '#');
                                        // if author is original dtuber
                                        if (originalDTubers_list.includes('#' + author + '#')) {
                                            tip = tip + acc.tipBoostForODs; // add the bonus on top
                                        }
                                        // if the total tip is higher than the max tip set for the curation account
                                        if (tip > acc.maxTip) {
                                            tip = acc.maxTip;
                                        }
                                        // prepare insert statement
                                        let sqlInsertCuration = insertCuration
                                            .replace('{author}', author)
                                            .replace('{permlink}', permLink)
                                            .replace('{curator}', "")
                                            .replace(new RegExp('{postedOnDate}', "g"), postedOnDate)
                                            .replace(new RegExp('{postedOnTime}', "g"), postedOnTime)
                                            .replace('{category}', category)
                                            .replace('{tip}', tip)
                                            .replace('{curationAccount}', acc.name);
                                        // save curation to database
                                        pool.query(sqlInsertCuration, async function (err, result) {
                                            if (err) throw err;
                                            responseFields.push({ name: acc.name, value: "The post got saved for execution!", inline: true });
                                            sendResponse(message, responseFields);
                                            return;
                                        });
                                    })
                                }).on('error', err => {
                                    console.log(err);
                                    return;
                                });
                            }
                        });
                    }
                });
            }
        } else {
            // when post not found: respond with error message
            sendErrorResponse(message, "Oops! something went wrong", "I was not able to find this post.. ");
        }
    });
}


async function curatePost(message, args, pool) {
    // check if category is a valid category
    pool.query(getCategoriesCommands, async function (err, result, fields) {
        if (err) throw err;
        values = [];
        result.forEach(element => {
            values.push(element["categoryShort"])
        });
        // if the category is valid
        if (values.includes(args[1])) {
            // check the link by syntax
            if (args[0] != null
                && args[0].includes("d.tube")
                && args[0].includes("/v/")) {
                    // continue with curation if the link is correct
                curateDTube(args, message, pool);
            } else {
                // send error to user if the link is not correct 
                sendErrorResponse(message, "Oops! something went wrong", "The link does not look like a dtube url.. ");
            }
        } else {
            // send error to user if the category is not valid 
            sendErrorResponse(message, "Oops! something went wrong", "**" + args[1] + "**" + " is not a valid category");
        }
    });
}

// success message
function sendResponse(message, response) {
    if (response.length == curationConfig.accounts.length) {
        message.channel.send({
            embed: {
                thumbnail: {
                    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Ice-cream_icon.svg/240px-Ice-cream_icon.svg.png",
                },
                color: 2067276,
                title: "Curation",
                description: "",
                fields: response
            }
        });
    }
}

// error message
function sendErrorResponse(message, responseTitle, responseValue) {
    message.channel.send({
        embed: {
            thumbnail: {
                url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Antu_application-exit.svg/240px-Antu_application-exit.svg.png",
            },
            color: 15158332,
            title: "Curation",
            description: "",
            fields: [{ name: responseTitle, value: responseValue, inline: true }]
        }
    });

}