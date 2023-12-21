const { Client } = require('discord.js-selfbot-v13');
const dotenv = require('dotenv')

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
const userid = process.env.USERID2;
const adminId = process.env.ADMIN_LIST.split(',');

client.on('message', async (message) => {
    const User = await client.users.fetch(userid);
    const myid = client.user.id
    if (adminId.includes(message.author.id) ||
        message.guild.id !== "707819253629452370"
    ) { return; }
    if (message.content === "w1start") {
        flag = 1;
        if (flag > 0) {
            targetChannel = client.channels.cache.get(message.channel.id);
            targetChannel.send("```py\nset\n```")
        }
    }
    if (message.content === "w1end") {
        flag = -1;
        if (flag < 0) {
            message.channel.send("```py\nend\n```")
            targetChannel = null
        }
    }
    if (message.content.startsWith("sp3.")) {
        msg = message.content.slice(4)
        message.channel.send(msg)
    }

    if (message.channel === targetChannel) {
        if (
            (message.content.includes(`${User.username}のHP:`) && !message.content.includes(`]の攻撃！`)) ||
            message.content.includes(`<@${userid}>はもうやられている`)
        ) {
            targetChannel.send("::atk ")
        }

    }



})

const token = process.env.TOKEN3;
client.login(token);
