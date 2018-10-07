const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix) => {
    
  if(message.content.startsWith(prefix + "mc")) {
	let typeapi = args[0]
	let ip = args[1]
 var req = require("request")

	if(typeapi === "server") {
	req('https://mcapi.us/server/status?ip=' + ip, (e, r, b)=> {
		let contenu = JSON.parse(b)
		if(contenu.online === false) {
			message.channel.send("Invalid hostname (i use only port `25565`) or offline")
		} else {
	const embed = new Discord.RichEmbed()
		embed.setTitle("<:minecraft:416218262196584449>")
		embed.setAuthor(bot.user.username, bot.user.avatarURL)
		embed.setColor(0x00AE86)
		embed.setFooter(bot.user.username, bot.user.avatarURL);
		embed.addField(ip, contenu.motd)
		embed.addField("Players", contenu.players.now + "/" + contenu.players.max)
		embed.addField("Version", contenu.server.name)
		embed.setThumbnail("http://mcapi.de/api/image/favicon/" + ip)
		embed.setTimestamp()
		message.channel.send({embed});
		}
	})
	}
	if(typeapi === "player") {
		req('https://mcapi.de/api/user/' + ip, (e, r, b)=> {
			let contenu = JSON.parse(b)
			if(contenu.premium === false) {
				message.channel.send("Invalid user or not premium")
			} else {
		const embed = new Discord.RichEmbed()
			embed.setTitle("<:minecraft:416218262196584449>")
			embed.setAuthor(bot.user.username, bot.user.avatarURL)
			embed.setColor(0x00AE86)
			embed.setFooter("Updated on " + contenu.updated.time + " (tz " + contenu.updated.zone + ")");
			embed.addField("Premium ?", "Yes ✅")
			embed.addField("UUID", contenu.uuid)
			embed.setThumbnail("https://minotar.net/helm/" + ip)
			embed.setImage("https://minotar.net/body/" + ip)
			embed.setTimestamp()
			message.channel.send({embed});
			}
		})
	}
	if(typeapi === "status") {
		req('http://mcapi.de/api/game/status/api.mojang.com', (e, r, b)=> {
			let contenu = JSON.parse(b)
		const embed = new Discord.RichEmbed()
			embed.setTitle("<:mojang:416218990222901268>")
			embed.setAuthor(bot.user.username, bot.user.avatarURL)
			embed.setColor(0x00AE86)
			embed.setFooter("Updated on " + contenu.updated.time + " (tz " + contenu.updated.zone + ")");
			embed.addField(contenu.service.part + " " + contenu.service.description, contenu.service.status)
			embed.setThumbnail("https://pbs.twimg.com/profile_images/658664874856333313/MhnCHMVD_400x400.png")
			embed.setTimestamp()
			message.channel.send({embed});
		})
	} if(typeapi != "status" && typeapi != "player" && typeapi != "server") {
		message.channel.send("__Args list :__\n\n`status` : to get MC/Mojang api status\n`player` : to get info about a player\n`server` : to get info about a server")
	}
}


  


			


};
