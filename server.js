// Discord.js bot
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");



client.on('ready', () => {
    client.user.setActivity('Just Testing to host || prefix .', {type: 'WATCHING'});
});

client.on('message', msg => {
    if (!msg.content.startsWith(process.env.PREFIX) || !msg.guild) return;
    const command = msg.content.split(' ')[0].substr(process.env.PREFIX.length);
    const args = msg.content.split(' ').slice(1).join(' ');
    if (command === 'guide') return msg.channel.send('https://git.io/d.js-heroku');
    else if (command === 'invite') return msg.channel.send(process.env.INVITE);
});

////////////commands////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.startsWith(prefix)){
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args);
   
	let guildCreateDelete = client.channels.get("496512276803747870");
  
  let log = new Discord.RichEmbed()
    .setTitle('dragon bot')
    .setColor("RANDOM")
    .addField('Logs Bot', `----------------\nCommand: ${command}\nRan by: ${message.author.tag}\n----------------`)
    .addField('commands from server', `Name: **${message.guild.name}** \nID: **${message.guild.id}**`)
    
    .setFooter(`${client.user.tag}`) //FOOTER AND ICON
    .setTimestamp(); //SHOWS THAT COOL TIME ON THE FOOTER!
  // .addField('Guild Info', `Name: **${guild.name}** \nID: **${guild.id}**`)
  guildCreateDelete.send(log);

    } catch (error) {
		  console.error(error);
      process.on('unhandledRejection', e => console.error(e.stack || e))
		  	};
  }
});


//////event/////////////////////////////////////////////////////////////////////////////////////////////////////////////
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});
//////d!///////////////////////////////////////////////////////////////////////////////////////////////////////////


client.on("message", (message) => {
  if(message.content === "d!") {
    message.channel.send("`Do d!help for show help commands !`");
    message.delete(10000)
  }

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////







client.login(process.env.TOKEN_BOT);
