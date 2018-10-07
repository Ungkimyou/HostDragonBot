// Discord.js bot

const Discord = require("discord.js");
const client = new Discord.Client();
const http = require('http');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyAiXso9DqLY7G6Iey-_9XQXE63NaWMojdg');
const queue = new Map(); 
const ytdl = require('ytdl-core'); 
const ffmpeg = require('ffmpeg'); 
const figlet = require("figlet")
const prefix = 'd!';
const ownerID = '424916247696900135'
const snekfetch = require("snekfetch")


////////////commands////////////////////////////////////////////////////////////////////////////////////////////////////////
client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.startsWith(prefix)){
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args );
   
	let guildCreateDelete = client.channels.get("494688036215586836");
  
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















client.on('ready', () => {
    client.user.setActivity('testing bot', {type: 'WATCHING'});
});

client.on('message', msg => {
    if (!msg.content.startsWith(process.env.PREFIX) || !msg.guild) return;
    const command = msg.content.split(' ')[0].substr(process.env.PREFIX.length);
    const args = msg.content.split(' ').slice(1).join(' ');
    if (command === 'guide') return msg.channel.send('https://git.io/d.js-heroku');
    else if (command === 'invite') return msg.channel.send(process.env.INVITE);
});
// Youtube////////////////////////
var servers = {};
client.on("message", async message => {
   if (message.channel.type == "dm") return;
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
    var searchString = args.slice(1).join(' ');
    var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    var serverQueue = queue.get(message.guild.id);
    switch (args[0].toLowerCase()) {
        //PLAY COMMAND 1
        case "play":
            var voiceChannel = message.member.voiceChannel;
            var error7 = new Discord.RichEmbed().setColor("990033")
                .setDescription('**I\'m sorry but you need to be in a voice channel to play music!**')
                .setColor(0x86e734)
            if (!voiceChannel) return message.channel.send(error7).then(msg => {
                msg.delete(25000)
            });
            var permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT')) {
                var error5 = new Discord.RichEmbed().setColor("990033")
                    .setDescription('**I cannot connect to your voice channel, make sure you are in the Music #2 Channel!**')
                    .setColor(0x86e734)
                return message.channel.send(error5).then(msg => {
                    msg.delete(25000)
                });
            }
            if (!permissions.has('SPEAK')) {
                var error6 = new Discord.RichEmbed().setColor("990033")
                    .setDescription('**I cannot speak in this voice channel, make sure you are in the Music #2 Channel!**')
                    .setColor(0x86e734)
                return message.channel.send(error6).then(msg => {
                    msg.delete(25000)
                });
            }
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                var playlist = await youtube.getPlaylist(url);
                var videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    var video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                    await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
                }
                return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
            } else {
                try {
                    var video = await youtube.getVideo(url);
                } catch (error) {
                    try {
                        var videos = await youtube.searchVideos(searchString, 10);
                        var index = 0;

                        var playing = new Discord.RichEmbed().setColor("990033")
                            .setDescription(`=>${videos.map(video2 => `\`${++index}\` - [${video2.title}](${video2.url})`).join('\n =>')}`)
                            .setFooter(`Please provide a value to select one of the search results ranging from 1-10.`)
                            .setColor(0x86e734)
                        message.channel.send(playing).then(msg => {
                            msg.delete(10000)
                        });
                        // ESLINT-DISABLE-NEXT-LINE MAX-DEPTH
                        try {
                            var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                                maxMatches: 1,
                                time: 10000,
                                errors: ['time']
                            });
                        } catch (err) {
                            console.error(err);
                            var error2 = new Discord.RichEmbed().setColor("990033")
                                .setDescription('**No or invalid value entered, cancelling video selection.**')
                                .setColor(0x86e734)
                            return message.channel.send(error2);
                        }
                        var videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        console.error(err);
                        var error1 = new Discord.RichEmbed().setColor("990033")
                            .setDescription('**I could not obtain any search results.**')
                            .setColor(0x86e734)
                        return message.channel.send(error1);
                    }
                }
                return handleVideo(video, message, voiceChannel);
            }
            break;
         //PLAY COMMAND 2
        case "p":
            var voiceChannel = message.member.voiceChannel;
            var error7 = new Discord.RichEmbed().setColor("990033")
                .setDescription('**I\'m sorry but you need to be in a voice channel to play music!**')
                .setColor(0x86e734)
            if (!voiceChannel) return message.channel.send(error7).then(msg => {
                msg.delete(25000)
            });
            var permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has('CONNECT')) {
                var error5 = new Discord.RichEmbed().setColor("990033")
                    .setDescription('**I cannot connect to your voice channel, make sure you are in the Music #2 Channel!**')
                    .setColor(0x86e734)
                return message.channel.send(error5).then(msg => {
                    msg.delete(25000)
                });
            }
            if (!permissions.has('SPEAK')) {
                var error6 = new Discord.RichEmbed().setColor("990033")
                    .setDescription('**I cannot speak in this voice channel, make sure you are in the Music #2 Channel!**')
                    .setColor(0x86e734)
                return message.channel.send(error6).then(msg => {
                    msg.delete(25000)
                });
            }
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                var playlist = await youtube.getPlaylist(url);
                var videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    var video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                    await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
                }
                return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
            } else {
                try {
                    var video = await youtube.getVideo(url);
                } catch (error) {
                    try {
                        var videos = await youtube.searchVideos(searchString, 10);
                        var index = 0;

                        var playing = new Discord.RichEmbed().setColor("990033")
                            .setDescription(`=>${videos.map(video2 => `\`${++index}\` - [${video2.title}](${video2.url})`).join('\n =>')}`)
                            .setFooter(`Please provide a value to select one of the search results ranging from 1-10.`)
                            .setColor(0x86e734)
                        message.channel.send(playing).then(msg => {
                            msg.delete(10000)
                        });
                        // ESLINT-DISABLE-NEXT-LINE MAX-DEPTH
                        try {
                            var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                                maxMatches: 1,
                                time: 10000,
                                errors: ['time']
                            });
                        } catch (err) {
                            console.error(err);
                            var error2 = new Discord.RichEmbed().setColor("990033")
                                .setDescription('**No or invalid value entered, cancelling video selection.**')
                                .setColor(0x86e734)
                            return message.channel.send(error2);
                        }
                        var videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        console.error(err);
                        var error1 = new Discord.RichEmbed().setColor("990033")
                            .setDescription('**I could not obtain any search results.**')
                            .setColor(0x86e734)
                        return message.channel.send(error1);
                    }
                }
                return handleVideo(video, message, voiceChannel);
            }
            break;
            //SKIP COMMAND 1
        case "skip":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            serverQueue.connection.dispatcher.end('Skip command has been used!');
            return undefined;
            break;
           //SKIP COMMAND 2
        case "s":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            serverQueue.connection.dispatcher.end('Skip command has been used!');
            return undefined;
            break;
            //STOP COMMAND
        case "stop":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end('Stop command has been used!');
            return undefined;
            break;
            //VOLUME COMMAND 1

            //WIP
        case "volume":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            var volval;
            if (serverQueue.volume == 1) {
                volval = `○──── :loud_sound:⠀`
            }
            if (serverQueue.volume == 2) {
                volval = `─○─── :loud_sound:⠀`
            }
            if (serverQueue.volume == 3) {
                volval = `──○── :loud_sound:⠀`
            }
            if (serverQueue.volume == 4) {
                volval = `───○─ :loud_sound:⠀`
            }
            if (serverQueue.volume == 5) {
                volval = `────○ :loud_sound:⠀`
            }
            message.channel.send(volval).then(msg => {
                msg.delete(10000)
            });
            break;
          //VOLUME COMMAND 2

            //WIP
        case "vol":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
            if (!serverQueue) return message.channel.send(nothing);
            if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
            serverQueue.volume = args[1];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
            var volval;
            if (serverQueue.volume == 1) {
                volval = `○──── :loud_sound:⠀`
            }
            if (serverQueue.volume == 2) {
                volval = `─○─── :loud_sound:⠀`
            }
            if (serverQueue.volume == 3) {
                volval = `──○── :loud_sound:⠀`
            }
            if (serverQueue.volume == 4) {
                volval = `───○─ :loud_sound:⠀`
            }
            if (serverQueue.volume == 5) {
                volval = `────○ :loud_sound:⠀`
            }
            message.channel.send(volval).then(msg => {
                msg.delete(10000)
            });
            break;
            //NOW PLAYING COMMAND
        case "nowplaying":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (!serverQueue) return message.channel.send(nothing);
         var volval;
        if (serverQueue.volume == 1) {
            volval = `○──── :loud_sound:⠀`
        }
        if (serverQueue.volume == 2) {
            volval = `─○─── :loud_sound:⠀`
        }
        if (serverQueue.volume == 3) {
            volval = `──○── :loud_sound:⠀`
        }
        if (serverQueue.volume == 4) {
            volval = `───○─ :loud_sound:⠀`
        }
        if (serverQueue.volume == 5) {
            volval = `────○ :loud_sound:⠀`
        }
         
            var NowEmbed = new Discord.RichEmbed().setColor("990033")
                .setDescription(`Now playing:<a:youtube:494230063143714847> **[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**<a:demoparty:494369882968948736>`)
                .setColor(0x86e734)
                 .addField(`**===================================**`,`
◄◄⠀▐▐ ⠀►►⠀　${volval}    :gear: ❐ ⊏⊐ 
**===================================**`)
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator}.\n -Invite Me! Using d!invitebot`)
            .setTimestamp()
            return message.channel.send(NowEmbed);
            break;
            //QUEUE COMMAND 1
        case "queue":
            if (!serverQueue) return message.channel.send('There is nothing playing.');
            return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
            break;
        //QUEUE COMMAND 2
        case "q":
            if (!serverQueue) return message.channel.send('There is nothing playing.');
            return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
            break;
            //PAUSE COMMAND
        case "pause":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (serverQueue && serverQueue.playing) {
                serverQueue.playing = false;
                serverQueue.connection.dispatcher.pause();
                return message.channel.send('⏸ Paused the music for you!');
            }
            return message.channel.send(nothing);
            break;
        
            //RESUME MUSIC COMMAND
        case "resume":
            var nothing = new Discord.RichEmbed().setColor("990033")
                .setDescription('**There is nothing playing.**')
                .setColor(0x86e734)
            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                return message.channel.send('▶ Resumed the music for you!');
            }
            return message.channel.send(nothing);


            return undefined;
            break;
    }
    //VIDEO HANDLER 
    async function handleVideo(video, message, voiceChannel, playlist = false) {
        var serverQueue = queue.get(message.guild.id);
        console.log(video);
        //META DATA
        var song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
        if (!serverQueue) {
            var queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };

            queue.set(message.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                queue.delete(message.guild.id);
                return message.channel.send(`I could not join the voice channel: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return undefined;
            else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
        }
        return undefined;
    }

    function play(guild, song) {
        var serverQueue = queue.get(guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        console.log(serverQueue.songs);

        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on('end', reason => {
                message.channel.send('``The queue of song is end.``');
                if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                else console.log(reason);
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            }).on('error', error => console.error(error));
        var volval;
        if (serverQueue.volume == 1) {
            volval = `○──── :loud_sound:⠀`
        }
        if (serverQueue.volume == 2) {
            volval = `─○─── :loud_sound:⠀`
        }
        if (serverQueue.volume == 3) {
            volval = `──○── :loud_sound:⠀`
        }
        if (serverQueue.volume == 4) {
            volval = `───○─ :loud_sound:⠀`
        }
        if (serverQueue.volume == 5) {
            volval = `────○ :loud_sound:⠀`
        }
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
         let sicon = message.guild.iconURL;
       var NowEmbed = new Discord.RichEmbed().setColor("990033")
            .setAuthor(message.guild.name, sicon)
            .setDescription(`Now playing:<a:youtube:494230063143714847>**[${song.title}](${song.url})**<a:demoparty:494369882968948736>`)
        
            .addField(`**===================================**`,`
◄◄⠀▐▐ ⠀►►⠀　${volval}    :gear: ❐ ⊏⊐ 
**===================================**`)
            .setFooter(`Requested by ${message.author.username}#${message.author.discriminator}.\n - Invite Me! Using d!invitebot`)
            .setColor(0x86e734)
            .setTimestamp()
        serverQueue.textChannel.send("Loading song...").then(msg => {
            msg.edit(NowEmbed)
        });

    }

  
});


client.login(process.env.TOKEN_BOT);
© 2018 GitHub, Inc.
