async function Eval(message) {
    const args = message.content.split(" ").slice(1);
    try {
        const evaled = eval(args.join(" "));
        message.channel.send(`\`\`\`js\n${evaled}\n\`\`\``);
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
    }
}
async function clickButton(message) {
    message.channel.send("::sinka")
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 10000 });
    const msg = collected?.first()
    await msg.clickButton({ row: 0, col: 0 })
    setTimeout(async () => await msg.clickButton({ row: 0, col: 0 }), 3000)
}

function setChannel(prefixes, message, targetChannelID, ResetSSRFlag, atkmsg) {
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
    return [targetChannelID, ResetSSRFlag]
}

async function moderate(client, message, prefix, atkmsg) {
    if (message.content.startsWith(`${prefix}say`)) {
        const channel = await client.channels.fetch(message.channel.id);
        channel.send(message.content.slice(prefix.length + 3));
    };
    if (message.content.includes(`${prefix}atk`)) {
        atkmsg = atkmsg === "::atk" ? '::i f' : '::atk'
        message.channel.send(`change ${atkmsg}`)
    };

    return atkmsg
}

module.exports = {
    setChannel: setChannel,
    clickButton: clickButton,
    Eval: Eval,
    setChannel: setChannel,
    moderate: moderate,
};