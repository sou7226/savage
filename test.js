
require('dotenv').config();

const { Client } = require('discord.js-selfbot-v13');
const client1 = new Client({ checkUpdate: false });
const client2 = new Client({ checkUpdate: false });
const client3 = new Client({ checkUpdate: false });
const client4 = new Client({ checkUpdate: false });
const functions = require('./src/functions');
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const coolTime = parseInt(process.env.coolTime), usedElixirCoolTime = parseInt(process.env.usedElixirCoolTime), Timeout = parseInt(process.env.Timeout);
const guildId = process.env.GUILD_ID;
const prefixes = process.env.prefixes
console.log(`prefixes is ${prefixes}`)
client1.once('ready', () => console.log(`${client1.user.username} is ${prefix1}`));
client2.once('ready', () => console.log(`${client2.user.username} is ${prefix2}`));
client3.once('ready', () => console.log(`${client3.user.username} is ${prefix3}`));
client4.once('ready', () => console.log(`${client4.user.username} is ${prefix4}`));

let adminId = new Set(process.env.ADMIN_LIST.split(','));
let SSRFlag = false, ResetSSRFlag = true, atkcounter = 0, time, targetChannelID;
let atkmsg1 = "::atk", atkmsg2 = "::atk", atkmsg3 = "::atk", atkmsg4 = "::atk";

let order = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 12,
    13, 14, 15, 16,
    17, 18, 19, 20,
    21, 22, 23, 24,
    25, 26, 27, 28,
    29, 30, 31, 32,
    33, 34, 35, 36,
    37, 38, 39, 40,
    41, 42, 43, 44,
    45, 46, 47, 48,
    49, 50, 51, 52,
    53, 54, 55, 56,
    57, 58, 59, 60,
    61, 62, 63, 64,
    65, 66, 67, 68,
    69, 70, 71, 72,
    73, 74, 75, 76,
    77, 78, 79, 80,
    81, 82, 83, 84,
    85, 86, 87, 88,
    89, 90, 91, 92,
    93, 94, 95, 96,
    97, 98, 99, 100
]

let tokens = [
    process.env.TOKEN1, process.env.TOKEN2, process.env.TOKEN3, process.env.TOKEN4,
    process.env.TOKEN5, process.env.TOKEN6, process.env.TOKEN7, process.env.TOKEN8,
    process.env.TOKEN9, process.env.TOKEN10, process.env.TOKEN11, process.env.TOKEN12,
    process.env.TOKEN13, process.env.TOKEN14, process.env.TOKEN15, process.env.TOKEN16,
    process.env.TOKEN17, process.env.TOKEN18, process.env.TOKEN19, process.env.TOKEN20,
    process.env.TOKEN21, process.env.TOKEN22, process.env.TOKEN23, process.env.TOKEN24,
    process.env.TOKEN25, process.env.TOKEN26, process.env.TOKEN27, process.env.TOKEN28,
    process.env.TOKEN29, process.env.TOKEN30, process.env.TOKEN31, process.env.TOKEN32,
    process.env.TOKEN33, process.env.TOKEN34, process.env.TOKEN35, process.env.TOKEN36,
    process.env.TOKEN37, process.env.TOKEN38, process.env.TOKEN39, process.env.TOKEN40,
    process.env.TOKEN41, process.env.TOKEN42, process.env.TOKEN43, process.env.TOKEN44,
    process.env.TOKEN45, process.env.TOKEN46, process.env.TOKEN47, process.env.TOKEN48,
    process.env.TOKEN49, process.env.TOKEN50, process.env.TOKEN51, process.env.TOKEN52,
    process.env.TOKEN53, process.env.TOKEN54, process.env.TOKEN55, process.env.TOKEN56,
    process.env.TOKEN57, process.env.TOKEN58, process.env.TOKEN59, process.env.TOKEN60,
    process.env.TOKEN61, process.env.TOKEN62, process.env.TOKEN63, process.env.TOKEN64,
    process.env.TOKEN65, process.env.TOKEN66, process.env.TOKEN67, process.env.TOKEN68,
    process.env.TOKEN69, process.env.TOKEN70, process.env.TOKEN71, process.env.TOKEN72,
    process.env.TOKEN73, process.env.TOKEN74, process.env.TOKEN75, process.env.TOKEN76,
    process.env.TOKEN77, process.env.TOKEN78, process.env.TOKEN79, process.env.TOKEN80,
    process.env.TOKEN81, process.env.TOKEN82, process.env.TOKEN83, process.env.TOKEN84,
    process.env.TOKEN85, process.env.TOKEN86, process.env.TOKEN87, process.env.TOKEN88,
    process.env.TOKEN89, process.env.TOKEN90, process.env.TOKEN91, process.env.TOKEN92,
    process.env.TOKEN93, process.env.TOKEN94, process.env.TOKEN95, process.env.TOKEN96,
    process.env.TOKEN97, process.env.TOKEN98, process.env.TOKEN99, process.env.TOKEN100
]

let groupToken = [
    gToken1,
    gToken2,
    gToken3,
    gToken4,
    gToken5,
    gToken6,
    gToken7,
    gToken8,
    gToken9,
    gToken10,
    gToken12,
    gToken13,
    gToken14,
    gToken15,
    gToken16,
    gToken17,
    gToken18,
    gToken19,
    gToken20,
    gToken21,
    gToken22,
    gToken23,
    gToken24,
    gToken25
]

client1.on("messageCreate", async (message) => {
    try {
        if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
        [targetChannelID, ResetSSRFlag] = await functions.setChannel(prefixes, message, targetChannelID, ResetSSRFlag, atkmsg1)
        if (message.content.startsWith(prefix1)) {
            atkmsg1 = await functions.moderate(client1, message, prefix1, atkmsg1)
        }
        if (
            targetChannelID == message.channel.id &&
            message.embeds.length > 0 &&
            message.embeds[0].title
        ) {
            const embedTitle = message.embeds[0].title;
            if (embedTitle.includes("が待ち構えている")) {
                SSRFlag = false
                if (message.embeds[0].author.name.includes("超激レア")) {
                    message.channel.send(`<@&${process.env.ROLE_ID}>`)
                    SSRFlag = true
                }
                await timeout(coolTime)
                message.channel.send(atkmsg1)
            } else if (embedTitle.includes("戦闘結果")) {
                atkcounter = 0;
            }
        } else if (targetChannelID == message.channel.id) {
            if (atkmsg4 === "::atk") {
                if (
                    (message.content.includes(`${client4.user.username}のHP:`) ||
                        message.content.includes(`<@${client4.user.id}>はもうやられている`)) &&
                    !message.content.includes('を倒した！')
                ) {
                    await timeout(coolTime)
                    message.channel.send(atkmsg1)
                }
            } else if (atkmsg4 === "::i f") {
                if (!message?.content.includes('を倒した！') &&
                    message?.content.includes(`${client4.user.username}の攻撃！`) ||
                    message?.content.includes("倒すなら拳で語り合ってください。")
                ) {
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
        if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
        if (message.content.startsWith(prefix2)) {
            atkmsg2 = await functions.moderate(client2, message, prefix2, atkmsg2)
        }
        if (targetChannelID == message.channel.id) {
            clearTimeout(time);
            if (atkmsg1 === "::atk") {
                if (
                    (message.content.includes(`${client1.user.username}のHP:`) ||
                        message.content.includes(`<@${client1.user.id}>はもうやられている`)) &&
                    !message.content.includes('を倒した！')
                ) {
                    await timeout(coolTime)
                    message.channel.send(ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg2)
                    atkcounter++;
                }
            } else if (atkmsg1 === "::i f") {
                if (
                    !message?.content.includes('を倒した！') &&
                    message?.content.includes(`${client1.user.username}の攻撃！`) ||
                    message?.content.includes("倒すなら拳で語り合ってください。")
                ) {
                    await timeout(coolTime)
                    message?.channel.send(ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg2)
                    atkcounter++;
                }
            }
            time = setTimeout(() => message.channel?.send(ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg2 + " to"), Timeout)
        }
    } catch (err) {
        console.error(err);
    }
});

client3.on("messageCreate", async (message) => {
    try {
        if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
        if (message.content.startsWith(prefix3)) {
            atkmsg3 = await functions.moderate(client3, message, prefix3, atkmsg3)
        }
        if (targetChannelID == message.channel.id && !SSRFlag || !ResetSSRFlag) {
            if (atkmsg2 === "::atk") {
                if (
                    (message.content.includes(`${client2.user.username}のHP:`) ||
                        message.content.includes(`<@${client2.user.id}>はもうやられている`)) &&
                    !message.content.includes('を倒した！')
                ) {
                    await timeout(coolTime)
                    message.channel.send(atkmsg3)
                }
            } else if (atkmsg2 === "::i f") {
                if (
                    !message?.content.includes('を倒した！') &&
                    message?.content.includes(`${client2.user.username}の攻撃！`) ||
                    message?.content.includes("倒すなら拳で語り合ってください。")
                ) {
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
        if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
        if (message.content.startsWith(prefix4)) {
            atkmsg4 = await functions.moderate(client4, message, prefix4, atkmsg4)
        }
        if (targetChannelID == message.channel.id) {
            if (atkmsg3 === "::atk") {
                if (
                    message.content.includes(`${client3.user.username}のHP:`) &&
                    !message.content.includes(`${client3.user.username}はやられてしまった。。。`) &&
                    !message.content.includes('を倒した！')
                ) {
                    await timeout(coolTime)
                    message.channel.send(atkmsg4)
                } else if (
                    message.content.includes(`${client3.user.username}のHP:`) &&
                    message.content.includes(`${client3.user.username}はやられてしまった。。。`) &&
                    !message.content.includes('を倒した！') ||
                    message.content.includes(`${client3.user.username}のHP:`) &&
                    message.content.includes(`${client3.user.username}は自滅してしまった。。。`) &&
                    !message.content.includes('を倒した！') ||
                    message.content.includes(`<@${client3.user.id}>はもうやられている！`)
                ) {
                    await timeout(coolTime)
                    message.channel.send("::i e ")
                    await timeout(usedElixirCoolTime)
                    message.channel.send(atkmsg4)
                }
            } else if (atkmsg3 === "::i f") {
                if (
                    !message?.content.includes('を倒した！') &&
                    message?.content.includes(`${client3.user.username}の攻撃！`) ||
                    message?.content.includes("倒すなら拳で語り合ってください。")
                ) {
                    await timeout(coolTime)
                    message?.channel.send(atkmsg4)
                }
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
/*
for (let i = 1; i <= tokens.length; i++) {
    if (i % 4 == 1) {
        try {
            client1.login(tokens[i]);
        } catch (err) {
            console.log("トークンがありません")
        }
    }
    if (i % 4 == 2) {
        try {
            client2.login(tokens[i]);
        } catch (err) {
            console.log("トークンがありません")
        }
    }
    if (i % 4 == 3) {
        try {
            client3.login(tokens[i]);
        } catch (err) {
            console.log("トークンがありません")
        }
    }
    if (i % 4 == 0) {
        try {
            client4.login(tokens[i]);
        } catch (err) {
            console.log("トークンがありません")
        }
    }
}
*/