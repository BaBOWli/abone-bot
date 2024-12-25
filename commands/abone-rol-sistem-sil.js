const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'arsksil',
    description: 'Abone rol sistemi siler.',
    async execute(client, message, args) {
        const serverId = message.guild.id;
        const systemData = JSON.parse(fs.readFileSync(path.join(__dirname, '../system.txt'), 'utf8') || '{}');

        if (!systemData[serverId]) {
            return message.reply('Bu sunucu için abone rol sistemi bulunmamaktadır.');
        }

        delete systemData[serverId];
        fs.writeFileSync(path.join(__dirname, '../system.txt'), JSON.stringify(systemData, null, 2));

        message.reply('Abone rol sistemi başarıyla silindi!');
    }
};
