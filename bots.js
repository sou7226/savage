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
let flag = -1, fbFlag = 1, time, targetChannelID;
let atkmsg1 = "::atk", atkmsg2 = "::atk", atkmsg3 = "::atk", atkmsg4 = "::atk";
const guildId = process.env.GUILD_ID;
let adminId = new Set(process.env.ADMIN_LIST.split(','));

function setChannel(message) {
    if (message.content === "w1start") {
        flag = 1;
        if (flag > 0) {
            targetChannelID = message.channel.id
            adminId.add(message.author.id)
            message.channel.send("```py\nset\n```")
        }
    }
    if (message.content === "w1end") {
        flag = -1;
        if (flag < 0) {
            targetChannelID = null
            message.channel.send("```py\nend\n```")
        }
    }
}


client1.on("messageCreate", (message) => {
    if (!adminId.has(message.author.id) &&
        message.guild.id !== guildId
    ) return;
    setChannel(message)
    if (message.content.startsWith("s1.")) {
        msg = message.content.slice(3)
        message.channel.send(msg)
    }
    if (message.content.includes("1.atk")) {
        atkmsg1 = atkmsg1 === "::atk" ? '::i f' : '::atk'
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
                message.channel.send("::re ")
            } else {
                message.channel.send(atkmsg1)
            }

        } else if (embedTitle.includes("戦闘結果")) {
        }
    } else if (targetChannelID == message.channel.id) {
        if (
            (message.content.includes(`${client4.user.username}のHP:`) || message.content.includes(`<@${client4.user.id}>はもうやられている`)) &&
            !message.content.includes('を倒した！')
        ) {
            message.channel.send(atkmsg1)
        }


    }
});

client2.on("messageCreate", (message) => {
    if (!adminId.has(message.author.id) &&
        message.guild.id !== guildId
    ) return;
    if (message.content.startsWith("s2.")) {
        msg = message.content.slice(3)
        message.channel.send(msg)
    }
    if (message.content.includes("2.atk")) {
        atkmsg2 = atkmsg2 === "::atk" ? '::i f' : '::atk'
    }
    clearTimeout(time);
    if (targetChannelID == message.channel.id) {
        if (
            (message.content.includes(`${client1.user.username}のHP:`) || message.content.includes(`<@${client1.user.id}>はもうやられている`)) &&
            !message.content.includes('を倒した！')
        ) {
            message.channel.send(atkmsg2)
        }
        time = setTimeout(() => message.channel?.send(atkmsg2), 8000)
    }
});

client3.on("messageCreate", async (message) => {
    if (!adminId.has(message.author.id) &&
        message.guild.id !== guildId
    ) return;
    if (message.content.startsWith("s3.")) {
        msg = message.content.slice(3)
        message.channel.send(msg)
    }
    if (message.content.includes("3.atk")) {
        atkmsg3 = atkmsg3 === "::atk" ? '::i f' : '::atk'
    }
    if (targetChannelID == message.channel.id) {
        if (atkmsg2 === "::atk") {
            if (
                (message.content.includes(`${client2.user.username}のHP:`) || message.content.includes(`<@${client2.user.id}>はもうやられている`)) &&
                !message.content.includes('を倒した！')
            ) {
                message.channel.send(atkmsg3)
            }
        } else if (atkmsg2 === "::i f" &&
            message.author.id === client2.user.id) {
            const filter = m => m.author.id === "526620171658330112";
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
            const response = collected?.first();
            if (!response?.content.includes('を倒した！') &&
                response?.content.includes(`${client2.user.username}の攻撃！`)
            ) {
                response?.channel.send(atkmsg3)
            }
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
    if (message.content.startsWith("s4.")) {
        msg = message.content.slice(3)
        message.channel.send(msg)
    }

    if (targetChannelID == message.channel.id) {
        if (atkmsg3 === "::atk") {
            if (message.content.includes(`${client3.user.username}のHP:`) && !message.content.includes('を倒した！')) {
                message.channel.send(atkmsg4)
            } else if (message.content.includes(`<@${client3.user.id}>はもうやられている`)) {
                message.channel.send("::i e ")
                await timeout(5000)
                message.channel.send(atkmsg4)
            }
        } else if (atkmsg3 === "::i f" &&
            message.author.id === client3.user.id) {
            const filter = m => m.author.id === "526620171658330112";
            const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
            const response = collected?.first();
            if (!response?.content.includes('を倒した！') &&
                response?.content.includes(`${client3.user.username}の攻撃！`)
            ) {
                response?.channel.send(atkmsg4)
            }
        }
    }
});



client1.login(process.env.TOKEN1);
client2.login(process.env.TOKEN2);
client3.login(process.env.TOKEN3);
client4.login(process.env.TOKEN4);