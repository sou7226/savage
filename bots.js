
require('dotenv').config();

const { Client } = require('discord.js-selfbot-v13');
const client1 = new Client({ checkUpdate: false });
const client2 = new Client({ checkUpdate: false });
const client3 = new Client({ checkUpdate: false });
const client4 = new Client({ checkUpdate: false });
const functions = require('./src/functions');
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const filter = m => m.author.id === "526620171658330112";
const coolTime = 500;
const guildId = process.env.GUILD_ID;
const prefixes = process.env.prefixes, prefix1 = process.env.prefix1, prefix2 = process.env.prefix2, prefix3 = process.env.prefix3, prefix4 = process.env.prefix4

client1.once('ready', () => console.log(`prefixes is ${prefixes}\n${client1.user.username} is ${prefix1}`));
client2.once('ready', () => console.log(`${client2.user.username} is ${prefix2}`));
client3.once('ready', () => console.log(`${client3.user.username} is ${prefix3}`));
client4.once('ready', () => console.log(`${client4.user.username} is ${prefix4}`));

let adminId = new Set(process.env.ADMIN_LIST.split(','));
let SSRFlag = false, ResetSSRFlag = false, time, targetChannelID;
let atkmsg1 = "::atk", atkmsg2 = "::atk", atkmsg3 = "::atk", atkmsg4 = "::atk";

client1.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    [targetChannelID, ResetSSRFlag] = functions.setChannel(prefixes, message, targetChannelID, ResetSSRFlag)
    if (message.content.startsWith(prefix1)) {
        atkmsg1 = await functions.moderate(client1, message, prefix1, atkmsg1)
    }
    if (
        // 監視対象のチャンネルで、かつEmbedが存在するメッセージの場合
        targetChannelID == message.channel.id &&
        message.embeds.length > 0 &&
        message.embeds[0].title
    ) {
        const embedTitle = message.embeds[0].title;
        if (embedTitle.includes("が待ち構えている")) {
            if (message.embeds[0].author.name.includes("超激レア")) {
                message.channel.send(`<@&${process.env.ROLE_ID}>`)
                SSRFlag = true
            }
            await timeout(coolTime)
            message.channel.send(atkmsg1)

        } else if (embedTitle.includes("戦闘結果")) {
        }
    } else if (targetChannelID == message.channel.id) {
        if (
            (message.content.includes(`${client4.user.username}のHP:`) || message.content.includes(`<@${client4.user.id}>はもうやられている`)) &&
            !message.content.includes('を倒した！')
        ) {
            await timeout(coolTime)
            message.channel.send(atkmsg1)
        }


    }
});

client2.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    if (message.content.startsWith(prefix2)) {
        atkmsg2 = await functions.moderate(client2, message, prefix2, atkmsg2)
    }
    if (targetChannelID == message.channel.id) {
        clearTimeout(time);
        if (
            (message.content.includes(`${client1.user.username}のHP:`) || message.content.includes(`<@${client1.user.id}>はもうやられている`)) &&
            !message.content.includes('を倒した！')
        ) {
            await timeout(coolTime)
            message.channel.send(ResetSSRFlag && SSRFlag ? "::re" : atkmsg2)
        } else if (message.content.includes('を倒した！')) {
            SSRFlag = false
        }
        time = setTimeout(() => message.channel?.send(ResetSSRFlag && SSRFlag ? "::re" : atkmsg2), 8000)
    }
});

client3.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    if (message.content.startsWith(prefix3)) {
        atkmsg3 = await functions.moderate(client3, message, prefix3, atkmsg3)
    }
    if (targetChannelID == message.channel.id) {
        if (atkmsg2 === "::atk") {
            if (
                (message.content.includes(`${client2.user.username}のHP:`) || message.content.includes(`<@${client2.user.id}>はもうやられている`)) &&
                !message.content.includes('を倒した！')
            ) {
                await timeout(coolTime)
                message.channel.send(atkmsg3)
            }
        } else if (atkmsg2 === "::i f" &&
            message.author.id === client2.user.id) {
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
            const response = collected?.first();
            if (!response?.content.includes('を倒した！') &&
                response?.content.includes(`${client2.user.username}の攻撃！`)
            ) {
                await timeout(coolTime)
                response?.channel.send(atkmsg3)
            }
        }
    }
});

client4.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    if (message.content.startsWith(prefix4)) {
        atkmsg4 = await functions.moderate(client4, message, prefix4, atkmsg4)
    }
    if (targetChannelID == message.channel.id) {
        if (atkmsg3 === "::atk") {
            if (message.content.includes(`${client3.user.username}のHP:`) && !message.content.includes(`${client3.user.username}はやられてしまった。。。`) && !message.content.includes('を倒した！')) {
                await timeout(coolTime)
                message.channel.send(atkmsg4)
            } else if (
                message.content.includes(`${client3.user.username}のHP:`) && message.content.includes(`${client3.user.username}はやられてしまった。。。`) && !message.content.includes('を倒した！') ||
                message.content.includes(`<@${client3.user.id}>はもうやられている！`)
            ) {
                await timeout(coolTime)
                message.channel.send("::i e ")
                await timeout(5000)
                message.channel.send(atkmsg4)
            }
        } else if (atkmsg3 === "::i f" &&
            message.author.id === client3.user.id) {
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
            const response = collected?.first();
            if (!response?.content.includes('を倒した！') &&
                response?.content.includes(`${client3.user.username}の攻撃！`)
            ) {
                await timeout(coolTime)
                response?.channel.send(atkmsg4)
            }
        }
    }
});



client1.login(process.env.TOKEN1);
client2.login(process.env.TOKEN2);
client3.login(process.env.TOKEN3);
client4.login(process.env.TOKEN4);
