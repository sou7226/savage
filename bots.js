
require('dotenv').config();

const { Client } = require('discord.js-selfbot-v13');
const client1 = new Client({ checkUpdate: false });
const client2 = new Client({ checkUpdate: false });
const client3 = new Client({ checkUpdate: false });
const client4 = new Client({ checkUpdate: false });
const functions = require('./src/functions');
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const coolTime = parseInt(process.env.coolTime), usedElixirCoolTime = parseInt(process.env.usedElixirCoolTime), Timeout = parseInt(process.env.Timeout);
const guildIds = process.env.GUILD_IDs;
const prefixes = process.env.prefixes, prefix1 = process.env.prefix1, prefix2 = process.env.prefix2, prefix3 = process.env.prefix3, prefix4 = process.env.prefix4
const isKeepFighting = (client, message) => (
    (message.content.includes(`${client.user.username}のHP:`) ||
        message.content.includes(`<@${client.user.id}>はもうやられている`)) &&
    !message.content.includes('を倒した！')
);
const isKFightFB = (client, message) => (
    !message?.content.includes('を倒した！') &&
    message?.content.includes(`${client.user.username}の攻撃！`) ||
    message?.content.includes("倒すなら拳で語り合ってください。")
);
console.log(`prefixes is ${prefixes}`)
client1.once('ready', () => console.log(`${client1.user.username} is ${prefix1}`));
client2.once('ready', () => console.log(`${client2.user.username} is ${prefix2}`));
client3.once('ready', () => console.log(`${client3.user.username} is ${prefix3}`));
client4.once('ready', () => console.log(`${client4.user.username} is ${prefix4}`));

let adminId = new Set(process.env.ADMIN_LIST.split(','));
let SSRFlag = false, ResetSSRFlag = true, atkFlag = "::atk", duoFlag = false
let atkcounter = 0, time, targetChannelID;
let atkmsg1 = "::atk", atkmsg2 = "::atk", atkmsg3 = "::atk", atkmsg4 = "::atk";



async function UsedElixir(client, message, atkmsg, coolTime, usedElixirCoolTime) {
    if (
        message.content.includes(`${client.user.username}のHP:`) &&
        !message.content.includes(`${client.user.username}はやられてしまった。。。`) &&
        !message.content.includes('を倒した！')
    ) {
        await timeout(coolTime)
        message.channel.send(atkmsg)
    } else if (
        message.content.includes(`${client.user.username}のHP:`) &&
        message.content.includes(`${client.user.username}はやられてしまった。。。`) &&
        !message.content.includes('を倒した！') ||
        message.content.includes(`${client.user.username}のHP:`) &&
        message.content.includes(`${client.user.username}は自滅してしまった。。。`) &&
        !message.content.includes('を倒した！') ||
        message.content.includes(`<@${client.user.id}>はもうやられている！`)
    ) {
        await timeout(coolTime)
        message.channel.send(ResetSSRFlag && SSRFlag ? "::atk" : "::i e")
        atkcounter++;
        await timeout(usedElixirCoolTime)
        message.channel.send(ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg2)
        atkcounter++;
    }
}

client1.on("messageCreate", async (message) => {
    try {
        if (!adminId.has(message.author.id) && message.guild.id.includes(guildIds)) return;
        [targetChannelID, ResetSSRFlag, duoFlag] = await functions.setChannel(prefixes, message, targetChannelID, ResetSSRFlag, atkmsg1, duoFlag) //client1でしか操作不可
        if (message.content.startsWith(prefix1)) {
            atkmsg1 = await functions.moderate(client1, message, prefix1, atkmsg1)
        }
        if (targetChannelID !== message.channel.id) return;
        if (message.embeds.length > 0 && message.embeds[0].title) {
            const embedTitle = message.embeds[0].title;
            if (embedTitle.includes("が待ち構えている")) {
                SSRFlag = false
                if (message.embeds[0].author.name.includes("超激レア")) {
                    message.channel.send(`<@&${process.env.ROLE_ID}>`)
                    SSRFlag = true
                }
                if (message.embeds[0].author.name &&
                    message.embeds[0].author.name.includes("超強敵") ||
                    embedTitle.includes("ジャックフロスト")) {
                    atkFlag = atkmsg1
                    atkmsg1 = "::i f"
                }
                await timeout(coolTime)
                message.channel.send(atkmsg1)
            } else if (embedTitle.includes("戦闘結果")) {
                atkcounter = 0;
                atkmsg1 = atkFlag
            }
        } else {
            if (duoFlag && isKeepFighting(client2, message)) {
                await timeout(coolTime)
                message.channel.send(atkmsg1)
            }
            if (atkmsg4 === "::atk") {
                if (isKeepFighting(client4, message)) {
                    await timeout(coolTime)
                    message.channel.send(atkmsg1)
                }
            } else if (atkmsg4 === "::i f") {
                if (isKFightFB(client4, message)) {
                    await timeout(coolTime)
                    message?.channel.send(atkmsg1)
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
});

client2.on("messageCreate", async (message) => {
    try {
        if (!adminId.has(message.author.id) && message.guild.id.includes(guildIds)) return;
        if (message.content.startsWith(prefix2)) {
            atkmsg2 = await functions.moderate(client2, message, prefix2, atkmsg2)
        }
        if (targetChannelID !== message.channel.id) return;
        clearTimeout(time);
        if (atkmsg1 === "::atk") {
            if (duoFlag) {
                await UsedElixir(client1, message, atkmsg2, coolTime, usedElixirCoolTime)
            } else if (isKeepFighting(client1, message)) {
                await timeout(coolTime)
                message.channel.send(ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg2)
                atkcounter++;
            }
        } else if (atkmsg1 === "::i f") {
            if (isKFightFB(client1, message)) {
                await timeout(coolTime)
                message?.channel.send(ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg2)
                atkcounter++;
            }
        }
        // time = setTimeout(sendMessage, Timeout);
        time = setTimeout(() => message.channel?.send(ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg2 + " to"), Timeout)
    } catch (err) {
        console.error(err);
    }
});

client3.on("messageCreate", async (message) => {
    try {
        if (!adminId.has(message.author.id) && message.guild.id.includes(guildIds)) return;
        if (message.content.startsWith(prefix3)) {
            atkmsg3 = await functions.moderate(client3, message, prefix3, atkmsg3)
        }
        if (targetChannelID == message.channel.id && !SSRFlag || !ResetSSRFlag) {
            if (atkmsg2 === "::atk") {
                if (duoFlag) return;
                if (
                    isKeepFighting(client2, message)
                ) {
                    await timeout(coolTime)
                    message.channel.send(atkmsg3)
                }
            } else if (atkmsg2 === "::i f") {
                if (isKFightFB(client2, message)) {
                    await timeout(coolTime)
                    message?.channel.send(atkmsg3)
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
});

client4.on("messageCreate", async (message) => {
    try {
        if (!adminId.has(message.author.id) && message.guild.id.includes(guildIds)) return;
        if (message.content.startsWith(prefix4)) {
            atkmsg4 = await functions.moderate(client4, message, prefix4, atkmsg4)
        }
        if (targetChannelID !== message.channel.id) return;
        if (atkmsg3 === "::atk") {
            await UsedElixir(client3, message, atkmsg4, coolTime, usedElixirCoolTime)
        } else if (atkmsg3 === "::i f") {
            if (isKFightFB(client3, message)) {
                await timeout(coolTime)
                message?.channel.send(atkmsg4)
            }
        }
    } catch (err) {
        console.error(err);
    }
});


client1.login(process.env.TOKEN1);
client2.login(process.env.TOKEN2);
client3.login(process.env.TOKEN3);
client4.login(process.env.TOKEN4);
