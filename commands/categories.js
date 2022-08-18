const currentDir = "/home/automations/bots/dtube_curation/discord_js/";
const { getCategoriesFullDescription } = require(currentDir + 'queries.json');
const mysql = require('mysql2');
module.exports = {
    name: 'categories',
    aliases: ['cats', 'curationcategories'],
    description: 'Get all curation categories you can use!',
    args: false,
    argsCount: 0,
    execute(message, args, pool) {
        mainCatsString = "";
        shortCatsString = "";
        longCatsString = "";
        count7days = "";
        pool.query(getCategoriesFullDescription, function (err, result, fields) {
            if (err) throw err;
            linecount = 0;
            result.forEach(element => {
                linecount++;
                mainCatsString = mainCatsString + element["mainCategory"] + '\n';
                longCatsString = longCatsString + element["categoryLong"] + '\n';
                shortCatsString = shortCatsString + element["mainCategory"] + " | " + element["categoryLong"] + " | **" + element["categoryShort"] + "**\n";
                if (linecount % 10 == 0) {
                    shortCatsString = shortCatsString + "\n";
                }
            });
            shortCatsStringArray = shortCatsString.split('\n\n');

            message.channel.send({
                embed: {
                    color: 2067276,
                    title: "Curation Categories",
                    description: "Here you can find all supported curation categories and their parameter name. Use the column command as <command> for your next curation.",
                    fields: [
                        { name: "Main | Category | command", value: shortCatsStringArray[0], inline: true }
                    ]
                }
            });
            if (shortCatsStringArray.length > 1) {
                shortCatsStringArray.shift();
                shortCatsStringArray.forEach(element => {
                    message.channel.send({
                        embed: {
                            color: 2067276,
                            title: "",
                            description: "",
                            fields: [
                                { name: "more", value: element, inline: true }
                            ]
                        }
                    });
                });
            }
        });
    }
}