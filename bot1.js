const { Client } = require('discord.js-selfbot-v13');
require('dotenv').config();
const client = new Client({
    checkUpdate: false,
});

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
})
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let flag = -1;
let targetChannel = null;
const userid = process.env.USERID4;
const adminId = process.env.ADMIN_LIST.split(',');

client.on('message', async (message) => {
    const User = await client.users.fetch(userid);
    const myid = client.user.id
    if (adminId.includes(message.author.id) ||
        message.guild.id !== guildId
    ) { return; }
    if (message.content === "w1start") {
        flag = 1;
        if (flag > 0) {
            targetChannel = client.channels.cache.get(message.channel.id);
            targetChannel.send("```py\nset\n```")

        }
    }
    if (message.content === "w1re") {
        message.channel.send("::re")
    }
    if (message.content === "w1re") {
        flag = 1;
        if (flag > 0) {
            targetChannel.send("::re")

        }
    }
    if (message.content === "w1end") {
        flag = -1;
        if (flag < 0) {
            message.channel.send("```py\nend\n```")
            targetChannel = null;
        }
    }
    if (message.content.startsWith("sp1.")) {
        msg = message.content.slice(4)
        message.channel.send(msg)
    }
    if (
        // 監視対象のチャンネルで、かつEmbedが存在するメッセージの場合
        message.channel === targetChannel &&
        message.embeds.length > 0 &&
        message.embeds[0].title
    ) {
        const embedTitle = message.embeds[0].title;
        if (embedTitle.includes("が待ち構えている")) {
            if (embedTitle.includes("超激レア")) {
                targetChannel.send("::re ")
            } else {
                targetChannel.send("::attack ")
            }

        } else if (embedTitle.includes("戦闘結果")) {
            console.log('戦闘結果ログ', embedTitle);
        }
    } else if (message.channel === targetChannel) {
        if (
            (message.content.includes(`${User.username}のHP:`) || message.content.includes(`<@${userid}>はもうやられている`)) &&
            !message.content.includes('を倒した！')
        ) {
            targetChannel.send("::atk ")
        }


    }

})

const token = process.env.TOKEN1;
client.login(token);

