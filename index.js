const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});


client.on('messageCreate', async message => {
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة القوانين')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#3533CD')
        .setThumbnail('https://media.discordapp.net/attachments/1126913955214930040/1307565138957570111/image-removebg-preview.png?ex=673ac46e&is=673972ee&hm=7bc12b3fd2a59a74fd4c77105f6623f474a60538da0b0da85fd869add4f4885b&=&format=webp&quality=lossless&width=445&height=445')
        .setTitle('قوانين السيرفر')
        .setDescription('**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت**')
        .setImage('https://media.discordapp.net/attachments/1126913955214930040/1307567395992375366/Untitled_design.png?ex=673ac688&is=67397508&hm=124eb9228a7f691c183a8487af58b6a8e03a897447fe36140e550b2d8cd03dd1&=&format=webp&quality=lossless&width=793&height=445')
        .setFooter({ text: 'Wizard Town Management' })
       

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#3533CD')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'Wizard Town Management' })
.setThumbnail('https://media.discordapp.net/attachments/1126913955214930040/1307565138957570111/image-removebg-preview.png?ex=673ac46e&is=673972ee&hm=7bc12b3fd2a59a74fd4c77105f6623f474a60538da0b0da85fd869add4f4885b&=&format=webp&quality=lossless&width=445&height=445')

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
