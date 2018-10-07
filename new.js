const Discord = require("discord.js");
const ownerID = '424916247696900135'


module.exports.run = async (bot, message, args, suffix) => {
  
//exports.create = {
//	usage: "<channel name>",
//	description: "creates a new text channel with the given name.",
//	process: function(bot,msg,suffix) {
		message.channel.guild.createChannel(suffix,"text").then(function(channel) {
			message.channel.send("created " + channel);
		}).catch(function(error){
			message.channel.send("failed to create channel: " + error);
		});
	}


     
