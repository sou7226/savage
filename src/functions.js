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

function setChannel(message, targetChannelID) {
    if (message.content === "w1run") {
        targetChannelID = message.channel.id;
        if (targetChannelID !== null) {
            message.channel.send("::atk \n```py\nset\n```")
        }
    }
    if (message.content === "w1end") {
        targetChannelID = null;
        if (targetChannelID === null) {
            message.channel.send("```py\nend\n```")
        }
    }
    return targetChannelID
}
module.exports = {
    setChannel: setChannel,
    clickButton: clickButton,
    Eval: Eval
};