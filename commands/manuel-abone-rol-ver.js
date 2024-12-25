module.exports = {
    name: 'mar',
    description: 'Manuel olarak abone rolü verir.',
    async execute(client, message, args) {
        const user = message.mentions.members.first();
        const role = message.guild.roles.cache.get('1320273390958809159');

        if (!user) {
            return message.reply('Lütfen bir kullanıcı belirtin!');
        }

        if (!role) {
            return message.reply('Abone rolü bulunamadı!');
        }

        await user.roles.add(role);
        message.reply(`${user.user.tag} adlı kullanıcıya abone rolü verildi.`);
    }
};
