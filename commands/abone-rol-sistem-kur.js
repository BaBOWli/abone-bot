const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'arsk',
    description: 'Abone rol sistemi kurar.',
    async execute(client, message, args) {
        const ssChannel = message.mentions.channels.first();
        const logChannel = message.mentions.channels.last();
        const role = message.mentions.roles.first();

        if (!ssChannel || !logChannel || !role) {
            return message.reply('Lütfen doğru kanalları ve rolü belirtin!');
        }

        const serverId = message.guild.id;
        const systemData = JSON.parse(fs.readFileSync(path.join(__dirname, '../system.txt'), 'utf8') || '{}');

        systemData[serverId] = {
            aboneSSChannel: ssChannel.id,
            aboneSSLogChannel: logChannel.id,
            aboneRoleId: role.id
        };

        fs.writeFileSync(path.join(__dirname, '../system.txt'), JSON.stringify(systemData, null, 2));

        message.reply('Abone sisteminiz başarıyla kuruldu!');
    }
};
