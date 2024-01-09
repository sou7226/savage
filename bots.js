
const { Client } = require('discord.js-selfbot-v13');
const setChannel = require('./src/functions');
const functions = require('./src/functions');

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
let superRareFlag = 0, time, targetChannelID;
let atkmsg1 = "::atk", atkmsg2 = "::atk", atkmsg3 = "::atk", atkmsg4 = "::atk";
const guildId = process.env.GUILD_ID;
let adminId = new Set(process.env.ADMIN_LIST.split(','));
const filter = m => m.author.id === "526620171658330112";
const coolTime = 500;
let sendFlags = {
    client1: 1,
    client2: 1,
    client3: 1,
    client4: 1
}
const isAtkMessage = (content, user) => (
    (content.includes(`${user.username}のHP:`) || content.includes(`<@${user.id}>はもうやられている`)) &&
    !content.includes('を倒した！')
);
function sendFlagReset() {
    sendFlags = {
        client1: 1,
        client2: 1,
        client3: 1,
        client4: 1
    }
}
client1.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) &&
        message.guild.id !== guildId
    ) return;
    targetChannelID = functions.setChannel(message, targetChannelID)
    if (message.content.startsWith("s1")) {
        msg = message.content.slice(2)
        message.channel.send(msg)
    }
    if (message.content.includes("1.atk")) {
        atkmsg1 = atkmsg1 === "::atk" ? '::i f' : '::atk'
    }
    if (message.content.startsWith("1.eval")) {
        await Eval(message)
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
                superRareFlag = 1
            } else {
                await timeout(coolTime)
                message.channel.send(atkmsg1)
            }

        } else if (embedTitle.includes("戦闘結果")) {
        }
    } else if (targetChannelID == message.channel.id) {
        if (isAtkMessage(message.content, client4.user)) {
            await timeout(coolTime)
            message.channel.send(atkmsg1)
        }
        if (message.content.includes(`${client1.user.username}はやられてしまった。。。`)) {
            sendFlags.client1 = 1
        }
    }
});

client2.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) &&
        message.guild.id !== guildId
    ) return;
    if (message.content.startsWith("s2")) {
        msg = message.content.slice(2)
        message.channel.send(msg)
    }
    if (message.content.includes("2.atk")) {
        atkmsg2 = atkmsg2 === "::atk" ? '::i f' : '::atk'
    }
    if (message.content.startsWith("2.eval")) {
        await Eval(message)
    }
    if (targetChannelID == message.channel.id) {
        clearTimeout(time);
        if (superRareFlag === 1) {
            superRareFlag = 0
            message.channel.send("::re ")
        } else if (isAtkMessage(message.content, client1.user)) {
            await timeout(coolTime)
            message.channel.send(atkmsg2)
        }
        if (message.content.includes(`${client2.user.username}はやられてしまった。。。`)) {
            sendFlags.client2 = 1
        }
        time = setTimeout(() => message.channel?.send(atkmsg2), 8000)

    }
});

client3.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) &&
        message.guild.id !== guildId
    ) return;
    if (message.content.startsWith("s3")) {
        msg = message.content.slice(2)
        await timeout(coolTime)
        message.channel.send(msg)
    }
    if (message.content.includes("3.atk")) {
        atkmsg3 = atkmsg3 === "::atk" ? '::i f' : '::atk'
    }
    if (message.content.startsWith("3.eval")) {
        await Eval(message)
    }
    if (targetChannelID == message.channel.id) {
        if (atkmsg2 === "::atk") {
            if (isAtkMessage(message.content, client2.user)) {
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
        if (message.content.includes(`${client3.user.username}はやられてしまった。。。`)) {
            sendFlags.client3 = 1
        }
    }
});

client4.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) &&
        message.guild.id !== guildId
    ) return;
    if (message.content.includes("4.atk")) {
        atkmsg4 = atkmsg4 === "::atk" ? '::i f' : '::atk'
        message.channel.send("change")
    }
    if (message.content.startsWith("s4")) {
        msg = message.content.slice(2)
        message.channel.send(msg)
    }
    if (message.content.startsWith("4.eval")) {
        await Eval(message)
    }
    if (targetChannelID == message.channel.id) {
        if (atkmsg3 === "::atk") {
            if (message.content.includes(`${client3.user.username}のHP:`) && !message.content.includes('を倒した！')) {
                await timeout(coolTime)
                message.channel.send(atkmsg4)
            } else if (message.content.includes(`<@${client3.user.id}>はもうやられている`)) {
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
        if (message.content.includes(`${client4.user.username}はやられてしまった。。。`)) {
            sendFlags.client4 = 1
        }
        if (message.content.includes('を倒した！')) {
            sendFlagReset()
        }
    }
});



client1.login(process.env.TOKEN1);
client2.login(process.env.TOKEN2);
client3.login(process.env.TOKEN3);
client4.login(process.env.TOKEN4);
