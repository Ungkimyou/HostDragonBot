const Discord = require("discord.js");


exports.run = async (bot) => {
  console.log(`${bot.user.tag} is online`);
 // bot.user.setActivity('d!help ||d!invitebot||') 
let onlinelogs = bot.channels.get("496512276803747870");
let online = new Discord.RichEmbed()
    .setTitle('Bot is Online NOw')
    .setColor("RANDOM")
  //  .addField('Bot has restarted,', ` with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`)
   // .setFooter(`${bot.user.tag}`) //FOOTER AND ICON
    .setTimestamp(); //SHOWS THAT COOL TIME ON THE FOOTER!
  onlinelogs.send(online);
}

