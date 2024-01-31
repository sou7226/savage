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
    if (message.content.includes(`${prefix}change`)) {
        atkmsg = atkmsg === "::atk" ? '::i f' : '::atk'
        message.channel.send(`change ${atkmsg}`)
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



module.exports = {
    setChannel: setChannel,
    clickButton: clickButton,
    Eval: Eval,
    moderate: moderate,
};

