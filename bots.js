
const { Client } = require('discord.js-selfbot-v13');
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

client1.atkmsg = "::atk"
client2.atkmsg = "::atk"
client3.atkmsg = "::atk"
client4.atkmsg = "::atk"

const prefix = "ww";
const guildId = process.env.GUILD_ID;
const coolTime = 500;
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const filter = m => m.author.id === "526620171658330112";
const isAtkMessage = (content, user) => (
    (content.includes(`${user.username}のHP:`) || content.includes(`<@${user.id}>はもうやられている`)) &&
    !content.includes('を倒した！')
);

let superRareFlag = 0, time, targetChannelID;
let atkmsgs = {
    client1: "::atk",
    client2: "::atk",
    client3: "::atk",
    client4: "::atk"
}
let adminId = new Set(process.env.ADMIN_LIST.split(','));
let sendFlags = {
    client1: 1,
    client2: 1,
    client3: 1,
    client4: 1
}

async function moderate(client, message, args) {
    if (message.content.startsWith(`${prefix}say`)) {
        const channel = await client.channels.fetch(message.channel.id);
        channel.send(args[1]);
    };
    if (message.content.includes(`${prefix}atk`)) {
        client.atkmsg = client.atkmsg === "::atk" ? '::i f' : '::atk'
        message.channel.send(`change ${client.atkmsg}`)
    };
}

client1.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    targetChannelID = functions.setChannel(message, targetChannelID)
    const args = message.content.slice(prefix.length).trim().split(" ").slice(1);
    if (message.content.startsWith(`${prefix}`) && args[0] === "1") {
        await moderate(client1, message, args)
    }

    if (
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
                message.channel.send(client1.atkmsg)
            }
        }
    } else if (targetChannelID == message.channel.id) {
        if (isAtkMessage(message.content, client4.user)) {
            await timeout(coolTime)
            message.channel.send(client1.atkmsg)
        }
        if (message.content.includes(`${client1.user.username}はやられてしまった。。。`)) {
            sendFlags.client1 = 1
        }
    }
});

client2.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    const args = message.content.slice(prefix.length).trim().split(" ").slice(1);
    if (message.content.startsWith(`${prefix}`) && args[0] === "2") {
        await moderate(client2, message, args)
    }

    if (targetChannelID == message.channel.id) {
        clearTimeout(time);
        if (superRareFlag === 1) {
            superRareFlag = 0
            message.channel.send("::re ")
        } else if (isAtkMessage(message.content, client1.user)) {
            await timeout(coolTime)
            message.channel.send(client2.atkmsg)
        }
        if (message.content.includes(`${client2.user.username}はやられてしまった。。。`)) {
            sendFlags.client2 = 1
        }
        time = setTimeout(() => message.channel?.send(client2.atkmsg), 8000)

    }
});

client3.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    const args = message.content.slice(prefix.length).trim().split(" ").slice(1);
    if (message.content.startsWith(`${prefix}`) && args[0] === "3") {
        await moderate(client3, message, args)
    }

    if (targetChannelID == message.channel.id) {
        if (client2.atkmsg === "::atk") {
            if (isAtkMessage(message.content, client2.user)) {
                await timeout(coolTime)
                message.channel.send(client3.atkmsg)
            }
        } else if (
            client2.atkmsg === "::i f" &&
            message.author.id === client2.user.id
        ) {
            console.log(message.content)
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
            const response = collected?.first();
            if (!response?.content.includes('を倒した！') &&
                response?.content.includes(`${client2.user.username}の攻撃！`)
            ) {
                await timeout(coolTime)
                response?.channel.send(client3.atkmsg)
            }
        }
        if (message.content.includes(`${client3.user.username}はやられてしまった。。。`)) {
            sendFlags.client3 = 1
        }
    }
});

client4.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) && message.guild.id !== guildId) return;
    const args = message.content.slice(prefix.length).trim().split(" ").slice(1);
    if (message.content.startsWith(`${prefix}`) && args[0] === "4") {
        await moderate(client4, message, args)
    }

    if (targetChannelID == message.channel.id) {
        if (client3.atkmsg === "::atk") {
            if (message.content.includes(`${client3.user.username}のHP:`) && !message.content.includes('を倒した！')) {
                await timeout(coolTime)
                message.channel.send(client4.atkmsg)
            } else if (message.content.includes(`<@${client3.user.id}>はもうやられている`)) {
                await timeout(coolTime)
                message.channel.send("::i e ")
                await timeout(5000)
                message.channel.send(client4.atkmsg)
            }
        } else if (client3.atkmsg === "::i f" &&
            message.author.id === client3.user.id) {
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
            const response = collected?.first();
            if (!response?.content.includes('を倒した！') &&
                response?.content.includes(`${client3.user.username}の攻撃！`)
            ) {
                await timeout(coolTime)
                response?.channel.send(client4.atkmsg)
            }
        }
        if (message.content.includes(`${client4.user.username}はやられてしまった。。。`)) {
            sendFlags.client4 = 1
        }
        if (message.content.includes('を倒した！')) {
            functions.sendFlagReset()
        }
    }
});


client1.login(process.env.TOKEN1);
client2.login(process.env.TOKEN2);
client3.login(process.env.TOKEN3);
client4.login(process.env.TOKEN4);
