const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const mongoose = require("mongoose");
const sub_records = require('../models/subscriptionRecords');
const config_records = require('../models/configurations');

module.exports = {
  name: "add",
  async interact(client, interaction) {
    try {
      await interaction.deferReply();
      if (!interaction.member.roles.cache.has("969173759581904946")) return interaction.editReply({
        content: "This command isn't for you.\n\nOnly <@&969173759581904946> can use this command.",
        ephemeral: true
      });
      const user = interaction.options.getUser('user');
      const userid = user.id;
      if (user.bot) return interaction.editReply({
        content: "You cannot add subscriptions to bots.",
        ephemeral: true
      });
      const months = interaction.options.getInteger('months');
      const isNew = interaction.options.getBoolean('new');
      const find_sub = await sub_records.find({
        discord_id: userid,
      });
      const foundNumber = find_sub.length;
      if (isNew) {
        await new sub_records({
          discord_id: userid,
          start_timestamp: interaction.createdTimestamp,
          months: months,
          end_timestamp: interaction.createdTimestamp + months * 31 * 24 * 60 * 60 * 1000,
          number: foundNumber + 1,
        }).save().catch((e) => {
          console.log(e);
        });
        return interaction.editReply({
          content: `The user <@${userid}> has been successfully subscribed on <t:${parseInt(interaction.createdTimestamp / 1000)}:F> for **${months}** months and the subscription will end on <t:${parseInt((interaction.createdTimestamp + months * 31 * 24 * 60 * 60 * 1000) / 1000)}:F>.\n**Number of subscriptions on this account : \`${foundNumber + 1}\`**`,
        }).catch((e) => {
          console.log(e);
        });
      } else {
        if (foundNumber === 0) return interaction.editReply({ content: "The user does not has an active subscription to extend." });
        const filter = (interaction) => interaction.customId === 'subs' && interaction.user.id === userid;
        const row = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId('subs')
              .setPlaceholder('Tap to Choose Subscription')
              .setMinValues(1)
              .setMaxValues(1)
          );
        const configs = await config_records.find({
          discord_id: userid,
        });
        const configsLength = configs.length;
        const left = foundNumber - configsLength;
        configs.forEach((config) => {
          row.components[0].addOptions({
            label: config.opensea_slug,
            value: config.number.toString(),
          });
        });
        if (left) {
          row.components[0].addOptions({
            label: `${left} Unused Subscriptions`,
            value: `NONE`,
          });
        };
        const reply = await interaction.editReply({
          content: `<@${userid}> Please choose the subscription you want to extend by using the menu below.\n\nYou have 24 hours to do so.`,
          components: [row],
          fetchReply: true,
        });
        let chosen;
        const collector = reply.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 1000 * 60 * 60 * 24 });
        collector.on('collect', async (i) => {
          if (i.user.id !== userid) return i.reply({ content: `This menu is not for you.`, ephemeral: true });
          const value = i.values[0];
          if (value === "NONE") {
            return i.reply({ content: "You cannot extend a subscription which you are not using yet.", ephemeral: true });
          } else {
            chosen = Number(value);
            const findconfig = configs.find((el) => el.number === chosen);
            const findsub = await sub_records.findOne({
              discord_id: userid,
              number: chosen,
            }).catch((e) => { });
            const oldTimestamp = findsub.end_timestamp;
            const newTimestamp = oldTimestamp + months * 31 * 24 * 60 * 60 * 1000;
            findsub.end_timestamp = newTimestamp;
            findsub.save().then(() => {
              i.update({
                content: `The subscription for ${findconfig.opensea_slug} has been extended from <t:${parseInt(oldTimestamp / 1000)}:F> to <t:${parseInt(newTimestamp / 1000)}:F>.`,
                components: [],
              }).then(collector.stop());
            });
          };
        });
      };
    } catch (e) {
      console.log(e);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: [],
          components: [],
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "I am facing some issues , the dev has been informed . Please try again in some hours.",
          embeds: [],
          components: [],
          ephemeral: true,
        });
      };
      client.users.cache.get("727498137232736306").send(`Bobot Sales has trouble in add.js -\n\n${e}`);
    };
  }
}