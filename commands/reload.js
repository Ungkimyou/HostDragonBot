
const ownerID = '424916247696900135'

exports.run = (client, message, args) => {
    if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    message.reply(`The command ${args[0]} has been reloaded`);
};