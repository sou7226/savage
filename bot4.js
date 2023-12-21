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
const userid = process.env.USERID3;
const guildId = process.env.GUILD_ID;
const adminId = process.env.ADMIN_LIST.split(',');

function setChannel(message) {
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
            targetChannel = null;
        }
    }
    return targetChannel

}
client.on('message', async (message) => {
    if (adminId.includes(message.author.id) ||
        message.guild.id !== guildId
    ) return;
    const myid = client.user.id
    const User = await client.users.fetch(userid);
    targetChannel = targetChannel ?? setChannel(message)

    if (message.content.startsWith('sp4.')) {
        const msg = message.content.slice(4)
        message.channel.send(msg)
    }
    if (message.channel === targetChannel) {
        if (message.content.includes(`${User.username}のHP:`) && !message.content.includes('を倒した！')) {
            targetChannel.send("::atk ")
        } else if (message.content.includes(`<@${userid}>はもうやられている`)) {
            targetChannel.send("::i e ")
            await timeout(5000)
            targetChannel.send("::atk")
        }
    }
})

const token = process.env.TOKEN4;
client.login(token);