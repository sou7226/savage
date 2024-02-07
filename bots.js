
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
const isFightFb = (client, message) => (
    !message?.content.includes('を倒した！') &&
    message?.content.includes(`${client.user.username}の攻撃！`) ||
    message?.content.includes("倒すなら拳で語り合ってください。")
);
const SSRMessage = (atkmsg) => {
    return ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg;
};
const spawnSuperRareProcess = () => {
    message.channel.send(`<@&${process.env.ROLE_ID}>`)
    SSRFlag = true
}
const sendMessage = async (message, content) => {
    await timeout(coolTime);
    message.channel.send(content);
};
console.log(`prefixes is ${prefixes}`)
client1.once('ready', () => console.log(`${client1.user.username} is ${prefix1}`));
client2.once('ready', () => console.log(`${client2.user.username} is ${prefix2}`));
client3.once('ready', () => console.log(`${client3.user.username} is ${prefix3}`));
client4.once('ready', () => console.log(`${client4.user.username} is ${prefix4}`));

let adminId = new Set(process.env.ADMIN_LIST.split(','));
let SSRFlag = false, ResetSSRFlag = true, atkFlag = "::atk", duoFlag = false
let atkcounter = 0, time, targetChannelID;
let atkmsg1 = "::atk", atkmsg2 = "::atk", atkmsg3 = "::atk", atkmsg4 = "::atk";

async function UsedElixir(client, message, atkmsg) {
    if (
        message.content.includes(`${client.user.username}のHP:`) &&
        !message.content.includes(`${client.user.username}はやられてしまった。。。`) &&
        !message.content.includes('を倒した！')
    ) {
        await sendMessage(message, atkmsg)
    } else if (
        message.content.includes(`${client.user.username}のHP:`) &&
        message.content.includes(`${client.user.username}はやられてしまった。。。`) &&
        !message.content.includes('を倒した！') ||
        message.content.includes(`${client.user.username}のHP:`) &&
        message.content.includes(`${client.user.username}は自滅してしまった。。。`) &&
        !message.content.includes('を倒した！') ||
        message.content.includes(`<@${client.user.id}>はもうやられている！`)
    ) {
        await sendMessage(message, ResetSSRFlag && SSRFlag ? "::atk" : "::i e")
        atkcounter++;
        await timeout(usedElixirCoolTime)
        message?.channel.send(SSRMessage(atkmsg))
        atkcounter++;
    }
}

client1.on("messageCreate", async (message) => {
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
                spawnSuperRareProcess()
            }
            if (message.embeds[0].author.name &&
                message.embeds[0].author.name.includes("超強敵") ||
                embedTitle.includes("ジャックフロスト")) {
                atkFlag = atkmsg1
                atkmsg1 = "::i f"
            }
            await sendMessage(message, atkmsg1)
        } else if (embedTitle.includes("戦闘結果")) {
            atkcounter = 0;
            atkmsg1 = atkFlag
        }
    } else {
        if (duoFlag && isKeepFighting(client2, message)) {
            await sendMessage(message, atkmsg1)
        }
        if (atkmsg4 === "::atk") {
            if (isKeepFighting(client4, message)) {
                await sendMessage(message, atkmsg1)
            }
        } else if (atkmsg4 === "::i f") {
            if (isFightFb(client4, message)) {
                await sendMessage(message, atkmsg1)
            }
        }
    }
});

client2.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id.includes(guildIds)) return;
    if (message.content.startsWith(prefix2)) {
        atkmsg2 = await functions.moderate(client2, message, prefix2, atkmsg2)
    }
    if (targetChannelID !== message.channel.id) return;
    clearTimeout(time);
    if (atkmsg1 === "::atk") {
        if (duoFlag) {
            await UsedElixir(client1, message, atkmsg2)
        } else if (isKeepFighting(client1, message)) {
            await sendMessage(message, atkmsg2)
            atkcounter++;
        }
    } else if (atkmsg1 === "::i f") {
        if (isFightFb(client1, message)) {
            await sendMessage(message, atkmsg2)
            atkcounter++;
        }
    }
    time = setTimeout(() => message.channel?.send(SSRMessage(atkmsg2) + " to"), Timeout)
});

client3.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id.includes(guildIds)) return;
    if (message.content.startsWith(prefix3)) {
        atkmsg3 = await functions.moderate(client3, message, prefix3, atkmsg3)
    }
    if (targetChannelID !== message.channel.id) return;
    if (!SSRFlag || !ResetSSRFlag) {
        if (atkmsg2 === "::atk") {
            if (duoFlag) return;
            if (
                isKeepFighting(client2, message)
            ) {
                await sendMessage(message, atkmsg3)
            }
        } else if (atkmsg2 === "::i f") {
            if (isFightFb(client2, message)) {
                await sendMessage(message, atkmsg3)
            }
        }
    }
});

client4.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id.includes(guildIds)) return;
    if (message.content.startsWith(prefix4)) {
        atkmsg4 = await functions.moderate(client4, message, prefix4, atkmsg4)
    }
    if (targetChannelID !== message.channel.id) return;
    if (atkmsg3 === "::atk") {
        await UsedElixir(client3, message, atkmsg4)
    } else if (atkmsg3 === "::i f") {
        if (isFightFb(client3, message)) {
            await sendMessage(message, atkmsg4)
        }
    }
});


client1.login(process.env.TOKEN1);
client2.login(process.env.TOKEN2);
client3.login(process.env.TOKEN3);
client4.login(process.env.TOKEN4);