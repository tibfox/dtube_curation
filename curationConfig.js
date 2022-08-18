var curationConfig = {};
curationConfig.accounts = [];

var curationAccountA =
{
    name: "curation Account name",
    key: "votingkey", // key should have voting and tipped voting persmissions
    voteWithVT: 1, // VT to use to vote (if voteWithPercentageOfRP is less than use that)
    voteWithPercentageOfRP: 1, // percent of total votes in current reward pool (if voteWithVT is less than use that)
    minVTBalance: 1, // min VT balance to execute a curation
    // not used yet values
    feedbackVT: 1, // VT used to self vote on comment (not used yet)
    firstCurationCommentContent: "", // first time curated posts receive this comment  (not used yet)
    useForFeedback: true, // use this account to send feedback from the curators (only one account should give feedback..)  (not used yet)
    maxQueueCount: 5, // collect max this count of curations (if VT balance is less than minVT)
    maxTip: 77, // max tip for posts
    tipBoostForODs: 1 // this added to the tip defined of the curator

};

curationConfig.accounts.push(curationAccountA);
module.exports = curationConfig;