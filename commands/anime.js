const Discord = require('discord.js');
const malScraper = require('mal-scraper');


module.exports.run = (bot, message, args) => {
   message.react("✅");
    var tag = args.join('+');
  var error54 = args.slice(0).join(' ');
  if (!tag || !error54) return message.channel.send(`:pencil: | Can you tell me what anime to search?`)

    const search = `${args}`;

  malScraper.getInfoFromName(search)
    .then((data) => {
    const malEmbed = new Discord.RichEmbed()
      .setAuthor(`My Anime List search result for ${args}`.split(',').join(' '))
      .setThumbnail(data.picture)
      .setColor('#ffc1cc') //I personally use bubblegum pink!
      .addField('English Title', data.englishTitle, true)
      .addField('Japanese Title', data.japaneseTitle, true)
      .addField('Type', data.type, true)
      .addField('Episodes', data.episodes, true)
      .addField('Rating', data.rating, true)
      .addField('Aired', data.aired, true)
      .addField('Score', data.score, true)
      .addField('Score Stats', data.scoreStats, true)
      .addField('Link', data.url);

      message.channel.send(malEmbed);

      //console.log(data);
    })
    .catch((err) => console.log(err));
  
}
module.exports.help = {
	name: "anime"
}
