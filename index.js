const Discord = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');

const client = new Discord.Client({
    disableEveryone: true,
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MEMBERS',
        'GUILD_MESSAGE_REACTIONS',
        'DIRECT_MESSAGES',
    ]
});

// Komutları yükleme
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    client.commands.set(command.name, command);
}

// Eventleri yükleme
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(__dirname, 'events', file));
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
}

client.once('ready', () => {
    console.log(`Bot ${client.user.username} olarak giriş yaptı!`);

    // Sunucularda hangi kanalları dinlediğini yazdır
    client.guilds.cache.forEach(guild => {
        console.log(`Sunucu: ${guild.name} (${guild.id})`);
        
        guild.channels.cache.forEach(channel => {
            console.log(`Kanal: ${channel.name} (ID: ${channel.id})`);
        });
    });
    // Durumlar arasında geçiş
    let currentStatusIndex = 0;
    const statuses = config.botStatus.activities;
    setInterval(() => {
        currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
        const currentStatus = statuses[currentStatusIndex];
        client.user.setActivity(currentStatus.activity, { type: currentStatus.type });
    }, 5000); // Her 5 saniyede bir durum değişir
});

// Botu başlat
client.login(config.token);
