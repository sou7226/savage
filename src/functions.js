require('dotenv').config();
const coolTime = parseInt(process.env.coolTime)
const usedElixirCoolTime = parseInt(process.env.usedElixirCoolTime)
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
const SSRMessage = (ResetSSRFlag, SSRFlag, atkcounter, atkmsg) => {
    return ResetSSRFlag && SSRFlag && atkcounter > 0 ? "::re" : atkmsg;
};
const spawnSuperRareProcess = (message, SSRFlag, roleID) => {
    message.channel.send(`<@&${roleID}>`)
    SSRFlag = true
    return  SSRFlag
}
const sendMessage = async (message, content, ct = coolTime) => {
    await timeout(ct);
    message.channel.send(content);
};

async function Eval(message) {
    const args = message.content.split(" ").slice(1);
    try {
        const evaled = eval(args.join(" "));
        message.channel.send(`\`\`\`js\n${evaled}\n\`\`\``);
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
}
async function clickButton(message, pos1, pos2) {
    try {
        await message.clickButton({ row: pos1, col: pos2 })
    } catch (err) {
        console.error(err);
    }
}

async function setChannel(prefixes, message, targetChannelID, ResetSSRFlag, atkmsg, duoFlag) {
    if (message.content === `${prefixes}run`) {
        targetChannelID = message.channel.id;
        if (targetChannelID !== null) {
            message.channel.send(`${atkmsg}`)
        }
    }
    if (message.content === `${prefixes}end`) {
        targetChannelID = null;
        if (targetChannelID === null) {
            message.channel.send("```py\nend\n```")
        }
    }
    if (message.content.includes(`${prefixes}reset`)) {
        ResetSSRFlag = ResetSSRFlag ? false : true
        message.channel.send(`change ${ResetSSRFlag}`)
    };
    if (message.content.includes(`${prefixes}duo`)) {
        duoFlag = duoFlag === false ? true : false
        message.channel.send(`DuoMode ${duoFlag}`)
    };
    return [targetChannelID, ResetSSRFlag, duoFlag]
}

async function moderate(client, message, prefix, atkmsg) {
    if (message.content.startsWith(`${prefix}say`)) {
        const channel = await client.channels.fetch(message.channel.id);
        channel.send(message.content.slice(prefix.length + 3));
    };
    if (message.content.includes(`${prefix}change`)) {
        atkmsg = atkmsg === "::atk" ? '::i f' : '::atk'
        message.channel.send(`change ${atkmsg}`)
    };
    if (message.content.includes(`${prefix}atk`)) {
        message.channel.send('::atk')
    };
    if (message.content.includes(`${prefix}fb`)) {
        message.channel.send('::i f')
    };
    if (message.content.includes(`${prefix}rmap`)) {
        message.channel.send('::rmap')
    };
    if (message.content.includes(`${prefix}i`)) {
        message.channel.send('::i')
    };
    if (message.content.includes(`${prefix}click`)) {
        const args = message.content.slice(prefix.length).trim().split(" ").slice(1);
        const msg = await message.channel.messages.fetch(args[0])
        await clickButton(msg, parseInt(args[1]), parseInt(args[2]))
    };

    return atkmsg
}
async function UsedElixir(client, message, atkmsg, ResetSSRFlag, SSRFlag, atkcounter) {
    if (
        message.content.includes(`${client.user.username}のHP:`) &&
        !message.content.includes(`${client.user.username}はやられてしまった。。。`) &&
        !message.content.includes('を倒した！')
    ) {
        await sendMessage(message, atkmsg, coolTime)
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
        await sendMessage(message, SSRMessage(ResetSSRFlag, SSRFlag, atkcounter, atkmsg), usedElixirCoolTime)
        atkcounter++;
    }
    return atkcounter
}

module.exports = {
    setChannel: setChannel,
    clickButton: clickButton,
    Eval: Eval,
    moderate: moderate,
    isKeepFighting: isKeepFighting,
    isFightFb: isFightFb,
    SSRMessage: SSRMessage,
    spawnSuperRareProcess: spawnSuperRareProcess,
    sendMessage: sendMessage,
    UsedElixir: UsedElixir
};

