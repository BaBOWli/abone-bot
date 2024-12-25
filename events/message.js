const fs = require('fs');
const path = require('path');
const tesseract = require('tesseract.js');
const { MessageEmbed } = require('discord.js');
const config = require('../config');

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    // Sunucuya ait verileri al
    const systemData = JSON.parse(fs.readFileSync(path.join(__dirname, '../system.txt'), 'utf8') || '{}');
    const serverData = systemData[message.guild.id];

    // Sunucu verisi yoksa işlem yapma
    if (!serverData) return;

    // Verileri çıkar
    const ssChannelId = serverData.aboneSSChannel;
    const logChannelId = serverData.aboneSSLogChannel;
    const aboneRoleId = serverData.aboneRoleId;

    // Eğer mesaj sadece metinse ve fotoğraf yoksa, mesajı sil
    if (message.channel.id === ssChannelId && message.attachments.size === 0) {
        await message.delete();
        return;
    }

    // Fotoğraf varsa işleme başla
    if (message.channel.id === ssChannelId && message.attachments.size > 0) {
        const attachment = message.attachments.first();
        let photoUrl = attachment.url;

        // OCR işlemi yap
        const { data: { text } } = await tesseract.recognize(photoUrl, 'eng');
        
        // 'Abone olundu' ve 'Quax MTA' metinlerini kontrol et
        const aboneRolVerildi = text.includes('Abone olundu') && text.includes('Quax MTA');

        // Log kanalına sonucu gönder
        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
            logChannel.send({
                embeds: [{
                    color: aboneRolVerildi ? 0x00FF00 : 0xFF0000,
                    title: aboneRolVerildi ? 'MESAJ İNCELENDİ' : 'MESAJ İNCELENDİ',
                    description: aboneRolVerildi ? '🟢 Abone rolü verildi' : '🔴 Abone rolü verilemedi',
                    timestamp: new Date().toISOString()
                }]
            });
        }

        // Abone rolü ver
        const member = message.guild.members.cache.get(message.author.id);
        if (aboneRolVerildi && member) {
            await member.roles.add(aboneRoleId);

            // Abone rolü verildiğinde mesajı düzenle
            await message.reply({
                embeds: [{
                    color: 0x00FF00,
                    title: 'MESAJ İNCELENDİ',
                    description: '🟢 Abone rolü verildi',
                    timestamp: new Date().toISOString()
                }]
            });
        } else {
            // Eğer abone rolü verilmediyse
            await message.reply({
                embeds: [{
                    color: 0xFF0000,
                    title: 'MESAJ İNCELENDİ',
                    description: '🔴 Abone rolü verilemedi\nSebep: Abone olduğunuz veya doğru kanala abone olduğunuz doğrulanamadı.',
                    timestamp: new Date().toISOString()
                }]
            });
        }
    }
};
