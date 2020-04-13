const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    alias: ['invite', 'i'],
    desc: 'Invites the bot',
    usage: ['//invite'],
    run: async (msg, args) => {
        let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        if(!member) member = msg.author;
        if(!member.username) member = member.user;

        let invites = await msg.guild.fetchInvites();
        if(!invites) {}
        else {
            invites = invites.filter(i => i.inviter.id == member.id);
        }

        let inviteEmbed = new Discord.MessageEmbed()
        .setTitle('Your Invites')
        .setThumbnail(member.displayAvatarURL({size:2048}))
        .setURL('https://discordapp.com/api/oauth2/authorize?client_id=557523643811495936&permissions=8&scope=bot')
        .addField('Invites', invites.size)
        .setFooter('Invite the bot to your server by clicking the title.', msg.client.user.displayAvatarURL({size:2048}));

        invites.forEach(v => {
            inviteEmbed.addField(`Code: ${v.code}`, `Total Use: ${v.uses}`);
        })

        return msg.channel.send({embed: inviteEmbed});
    }
}