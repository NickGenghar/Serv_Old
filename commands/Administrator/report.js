const Discord = require('discord.js');
const fs = require('fs');

const color = require('../../configurations/color.json');

module.exports = {
	name: 'report',
    alias: ['report'],
    desc: 'Report a user.',
    usage: ['//report <user> <reason>\nuser: Target user to  be reported,\nreason: Reason why they got reported.\n\n Reason must be provided in order for this command to succeed.'],
    run: async (msg, args) => {
        const svr = JSON.parse(fs.readFileSync(`./data/guilds/${msg.guild.id}.json`));
        if(svr.modRole.length <= 0) return msg.channel.send('No Moderator Role Set.');
        if(!msg.guild.member(msg.author).roles.cache.find(r => svr.modRole.includes(r.id))) return msg.channel.send('You do not have the required moderation role.');

        let reportUser = msg.mentions.users.first() || msg.guild.members.cache.get(args[0]);
        args.shift();
        let reason = args.join(' ');

        if (!reportUser) return msg.channel.send('Couldn\'t find the user.');
        if (reason.length <= 0) return msg.channel.send('Cannot report a user without a reason.');

        let reportEmbed = new Discord.MessageEmbed()
            .setDescription('Report ticket')
            .setColor(color.yellow)
            .addField('Reported user', `${reportUser}`, true)
            .addField('User ID:', `${reportUser.id}`, true)
            .addField('Reported by', `${msg.author}`, true)
            .addField('User ID:', `${msg.author.id}`, true)
            .addField('Channel', `${msg.channel}`, true)
            .addField('Time', `${msg.createdAt}`, true)
            .addField('Reason', reason, true);

        let reportChannel = msg.guild.channels.cache.find(c => c.id == svr.logChan);
        if (!reportChannel) {
            reportChannel = msg.channel;
            msg.channel.send('Report channel doesn\'t exist. Sending report to local channel instead.');
        }
        reportChannel.send({ embed: reportEmbed });
    }
}