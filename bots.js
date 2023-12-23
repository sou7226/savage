const { Client } = require('discord.js-selfbot-v13');
const dotenv = require('dotenv')

require('dotenv').config();
const client1 = new Client({ checkUpdate: false });
const client2 = new Client({ checkUpdate: false });
const client3 = new Client({ checkUpdate: false });
const client4 = new Client({ checkUpdate: false });

client1.once('ready', () => console.log(`${client1.user.username} is ready!`));
client2.once('ready', () => console.log(`${client2.user.username} is ready!`));
client3.once('ready', () => console.log(`${client3.user.username} is ready!`));
client4.once('ready', () => console.log(`${client4.user.username} is ready!`));

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let flag = -1, time, targetChannel1, targetChannel2, targetChannel3, targetChannel4;
const guildId = process.env.GUILD_ID;
const adminId = process.env.ADMIN_LIST.split(',');

function setChannel(targetChannel, message) {
    if (message.content === "w1start") {
        flag = 1;
        if (flag > 0) {
            targetChannel = message.channel
            message.channel.send("```py\nset\n```")
        }
    }
    if (message.content === "w1end") {
        flag = -1;
        if (flag < 0) {
            targetChannel = null
            message.channel.send("```py\nend\n```")
        }
    }
}


client1.on("messageCreate", (message) => {
    if (adminId.includes(message.author.id) ||
        message.guild.id !== guildId
    ) return;
    targetChannel1 = setChannel(targetChannel1, message)
    if (
        // 監視対象のチャンネルで、かつEmbedが存在するメッセージの場合
        targetChannel1.name == message.channel.name &&
        message.embeds.length > 0 &&
        message.embeds[0].title
    ) {
        const embedTitle = message.embeds[0].title;
        if (embedTitle.includes("が待ち構えている")) {
            if (message.embeds[0].author.name.includes("超激レア")) {
                targetChannel1.send("::re ")
            } else {
                message.channel.send("::i f ")
            }

        } else if (embedTitle.includes("戦闘結果")) {
        }
    } else if (targetChannel1.name == message.channel.name) {
        if (
            (message.content.includes(`${client4.user.username}のHP:`) || message.content.includes(`<@${client4.user.id}>はもうやられている`)) &&
            !message.content.includes('を倒した！')
        ) {
            message.channel.send("::i f ")
        }


    }
});

client2.on("messageCreate", (message) => {
    if (adminId.includes(message.author.id) ||
        message.guild.id !== guildId
    ) return;
    targetChannel2 = setChannel(targetChannel2, message)
    clearTimeout(time);
    if (targetChannel2.name == message.channel.name) {
        if (
            (message.content.includes(`${client1.user.username}のHP:`) || message.content.includes(`<@${client1.user.id}>はもうやられている`)) &&
            !targetChannel2.includes('を倒した！')
        ) {
            message.channel.send("::i f ")
        }
        time = setTimeout(() => targetChannel2?.send("::atk interval"), 8000)
    }
});

client3.on("messageCreate", async (message) => {
    if (adminId.includes(message.author.id) ||
        message.guild.id !== guildId
    ) return;
    targetChannel3 = setChannel(targetChannel3, message)
    if (targetChannel3.name == message.channel.name) {
        if (
            (message.content.includes(`${client2.user.username}のHP:`) || message.content.includes(`<@${client2.user.id}>はもうやられている`)) &&
            !targetChannel3.includes('を倒した！')
        ) {
            message.channel.send("::i f ")
        }
    }
});

client4.on("messageCreate", async (message) => {
    if (adminId.includes(message.author.id) ||
        message.guild.id !== guildId
    ) return;
    targetChannel4 = setChannel(targetChannel4, message)
    if (targetChannel4.name == message.channel.name) {
        if (message.content.includes(`${client3.user.username}のHP:`) && !message.content.includes('を倒した！')) {
            message.channel.send("::i f ")
        } else if (message.content.includes(`<@${client3.user.id}>はもうやられている`)) {
            targetChannel4.send("::i e ")
            await timeout(5000)
            message.channel.send("::i f ")
        }
    }
});



client1.login(process.env.TOKEN1);
client2.login(process.env.TOKEN2);
client3.login(process.env.TOKEN3);
client4.login(process.env.TOKEN4);