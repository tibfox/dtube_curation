const uuid = require('uuid');
var async = require("async");

const mysql2 = require('mysql2');
const currentDir = "/home/automations/bots/dtube_curation/discord_js/"
var config = require(currentDir + 'config.js');
var curationConfig = require(currentDir + 'curationConfig.js');
const { openCurations, updateCurationDone, updateFirstCurationCommentDone, unexecutedFirstCurationComments, unexecutedFeedback, updateFeedbackSent } = require(currentDir + 'queries.json');

var db_config = {
    host: "localhost",
    user: config.mysql.user,
    password: config.mysql.pw,
    database: config.mysql.db
};
var con;

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql2.createPool(db_config);


async function curateAll() {
    const javalon = require('javalon');
    await javalon.init({ api: config.avalon.node });

    for (curationAccount in curationConfig.accounts) {
        let acc = curationConfig.accounts[curationAccount];

        console.log("\n" + acc.name + " - " + acc.key);
        // get unexecuted curations stored for the curation account
        let queryGetQueuedCurations = openCurations.replace('{curationAccount}', acc.name);
        console.log(queryGetQueuedCurations);

        // CURATE
        pool.query(queryGetQueuedCurations, function (err, result, fields) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(result);
            for (let curation of result) {
                javalon.getAccount(acc.name, async function (err, account) {
                    console.log(account.name);
                    vt = javalon.votingPower(account);
                    // if the current VT is bigger than the set minimum
                    if (vt > acc.minVTBalance) {
                        try {
                            setTimeout(function () {
                                let vtToVote = acc.voteWithVT;
                                // check percentage of votes in current reward pool set for the curationAccount
                                javalon.getRewardPool(async function (err, poolData) {
                                    let totalVotes = poolData["votes"];
                                    // if percentage of votes in reward pool is less than minVT set for the curationAccount 
                                    if(totalVotes > 0 && totalVotes/100 * acc.voteWithPercentageOfRP < vtToVote){
                                        //use percentage instead of fixed vote
                                        vtToVote = parseInt(totalVotes /100 * acc.voteWithPercentageOfRP);
                                    }
                                });
                                // prepare the tx
                                let author = curation["postAuthor"];
                                let permlink = curation["postPermlink"];
                                let tag = curation["curationtag"];
                                let tip = curation["tip"];
                                let newTx = {
                                    type: javalon.TransactionType.VOTE,
                                    data: {
                                        author: author,
                                        link: permlink,
                                        tag: tag,
                                        vt: acc.voteWithVT
                                    }
                                }
                                // if it is a tipped curation
                                if (parseInt(tip) > 0) {
                                    newTx = {
                                        type: javalon.TransactionType.TIPPED_VOTE,
                                        data: {
                                            author: author,
                                            link: permlink,
                                            tag: tag,
                                            vt: acc.voteWithVT,
                                            tip: parseInt(tip)
                                        }
                                    }
                                }
                                // sign and broadcast tx
                                javalon.sendRawTransaction(javalon.sign(acc.key, acc.name, newTx), async function (err, res) {
                                    console.log(err);
                                    if (err) {
                                        console.log(err['error']);
                                        if (err['error'] == 'invalid tx user has already voted') {
                                             updatePostCurated(author, permlink, acc.name);

                                        }
                                        if (err['error'] == 'author has already claimed reward') {
                                            updatePostCurated(author, permlink, acc.name);

                                        }
                                    }
                                    if (!err) {
                                        updatePostCurated(author, permlink, acc.name);
                                        console.log(newTx.result);
                                    }
                                }, 1000);
                            });
                        } catch (error) {
                            console.log("tx error ... " + error);
                            // TODO: error handling
                        }

                    } else {
                        console.log(vt + " is not enough. We set " + acc.minVTBalance + " as the minimum.");
                        return;
                    }
                });
            }
        });
    }
}


function updatePostCurated(author, permlink, account) {
    //update row in db
    let sqlUpdateCurationDone = updateCurationDone
        .replace('{author}', author)
        .replace('{permlink}', permlink)
        .replace('{curationAccount}', account);

    pool.query(sqlUpdateCurationDone, function (err, result) {
        if (err) throw err;
        console.log(author + '/' + permlink + "  updated");
    });
}


// async function feedbackCommentsAll() {

//     const javalon = require('javalon');
//     await javalon.init({ api: config.avalon.node });
//     let sqlUnexecutedFeedback = unexecutedFeedback;

//     pool.query(sqlUnexecutedFeedback, async function (err, result, fields) {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         for (row of result) {

//             for (const curationAccount in curationConfig.accounts) {
//                 if (curationAccount.useForFeedback) {
//                     javalon.getAccount(curationAccount.name, async function (err, account) {
//                         vt = javalon.votingPower(account)
//                         if (vt > curationAccount.minVTBalance) {
//                             var author = row["postAuthor"];
//                             var permlink = row["postLink"];
//                             var feedback = row["feedback"];
//                             var newTx = {
//                                 type: javalon.TransactionType.COMMENT,
//                                 data: {
//                                     link: uuid.v1(),
//                                     vt: curationAccount.feedbackVT,
//                                     pa: author,
//                                     pp: permlink,
//                                     tag: 'feedback',
//                                     json: {
//                                         description: feedback,
//                                         title: ''
//                                     }
//                                 }
//                             }
//                             newTx = javalon.sign(curationAccount.key, curationAccount.name, newTx);
//                             console.log(newTx);
//                             javalon.sendRawTransaction(newTx, async function (err, res) {
//                                 console.log(err);
//                                 // TODO error handling
//                                 feedbackDone(author, permlink);
//                                 console.log(newTx.result);
//                             });

//                         } else {
//                             console.log(vt + " is not enough. We set " + curationAccount.minVTBalance + " as the minimum.");
//                             return;
//                         }
//                     });
//                 }
//             }

//             setTimeout(function () {
//                 console.log("waiting for next feedback");
//             }, 500);
//         }
//     });

// }


// async function firstCurationCommentsAll() {

//     const javalon = require('javalon');
//     await javalon.init({ api: config.avalon.node });

//     // FEEDBACK
//     for (const curationAccount in curationConfig.accounts) {
//         acc = curationConfig.accounts[curationAccount];
//         if (acc.useForFeedback) {
//             let sqlUnexecutedFirstCurationComments = unexecutedFirstCurationComments
//                 .replace('{curationAccount}', acc.name);

//             pool.query(sqlUnexecutedFirstCurationComments, async function (err, result, fields) {
//                 if (err) {
//                     console.log(err);
//                     return;
//                 }
//                 for (row of result) {


//                     javalon.getAccount(accname, async function (err, account) {
//                         vt = javalon.votingPower(account)
//                         if (vt > acc.minVTBalance) {
//                             var author = row["postAuthor"];
//                             var permlink = row["postPermlink"];
//                             var tag = row["curationtag"];
//                             var tip = row["tip"];
//                             var newTx = {
//                                 type: javalon.TransactionType.COMMENT,
//                                 data: {
//                                     link: uuid.v1(),
//                                     vt: acc.feedbackVT,
//                                     pa: author,
//                                     pp: permlink,
//                                     tag: tag,
//                                     json: {
//                                         description: acc.firstCurationCommentContent,
//                                         title: ''
//                                     }
//                                 }
//                             }
//                             newTx = javalon.sign(acc.key, acc.name, newTx);

//                             javalon.sendRawTransaction(newTx, async function (err, res) {
//                                 if (err) throw err;
//                                 firstCurationCommentDone(author, permlink);
//                             });

//                         } else {
//                             console.log(vt + " is not enough. We set " + acc.minVTBalance + " as the minimum.");
//                             return;
//                         }
//                     });


//                     setTimeout(function () {
//                         console.log("waiting for next one");
//                     }, 500);
//                 }
//             });

//         }
//     }
// }



// function firstCurationCommentDone(author, permlink) {
//     //update row in db
//     let sqlUpdateFirstCurationCommentDone = updateFirstCurationCommentDone
//         .replace('{author}', author)
//         .replace('{permlink}', permlink)

//     pool.query(sqlUpdateFirstCurationCommentDone, function (err, result) {
//         if (err) throw err;
//         c
//     });
// }

// function feedbackDone(author, permlink) {
//     //update row in db
//     let sqlFeedbackDone = updateFeedbackSent
//         .replace('{author}', author)
//         .replace('{permlink}', permlink)

//     pool.query(sqlFeedbackDone, function (err, result) {
//         if (err) throw err;

//     });
// }

async.forever(
    function (next) {
        console.log("curateAll started");
        curateAll();
        // firstCurationCommentsAll();
        // feedbackCommentsAll();
        setTimeout(function () {
            next();
        }, 30000)
    });
