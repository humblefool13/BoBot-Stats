const sub_records = require('../models/subscriptionRecords');
const free_users = require('../models/freeTrials');
const config_records = require('../models/configurations');

module.exports = {
  name: "freetrial",
  async interact(client, interaction) {
    try {
      await interaction.deferReply();
      if (!interaction.member.roles.cache.has("969173759581904946")) return interaction.editReply({
        content: "This command isn't for you.\n\nOnly <@&969173759581904946> can use this command.",
        ephemeral: true
      });
      const user = interaction.options.getUser("user");
      const userid = user.id;
      if (user.bot) return interaction.editReply({
        content: "You cannot add subscriptions to bots.",
        ephemeral: true
      });
      const find = await free_users.findOne({
        discord_id: userid,
      });
      if (find) return interaction.editReply({
        content: `The user <@${userid}> had a free trial already.`,
      });
      const active_configs = await config_records.find({
        discord_id: userid,
        expired: false,
      });
      const inactive_configs = await config_records.find({
        discord_id: userid,
        expired: true,
      });
      const inactiveNumbers = inactive_configs.map((el) => el.number);
      const activeNumbers = active_configs.map((el) => el.number);
      let freshnumber = 0;
      let foundNumberB = false;
      do {
        ++freshnumber;
        if (!inactiveNumbers.includes(freshnumber) && !activeNumbers.includes(freshnumber)) {
          foundNumberB = true;
        }
      } while (!foundNumberB)
      await new sub_records({
        discord_id: userid,
        start_timestamp: interaction.createdTimestamp,
        months: 0,
        end_timestamp: interaction.createdTimestamp + 7 * 24 * 60 * 60 * 1000,
        number: freshnumber,
      }).save().catch((e) => {
        console.log(e);
      });
      await new free_users({
        discord_id: userid,
      }).save().catch((e) => {
        console.log(e);
      });
      return interaction.editReply({
        content: `:tada: **Free Subscription Confirmed** :tada:\n\nThe user <@${userid}> has been successfully subscribed on <t:${parseInt(interaction.createdTimestamp / 1000)}:F> for **1** week and the subscription will end on <t:${parseInt((interaction.createdTimestamp + 7 * 24 * 60 * 60 * 1000) / 1000)}:F>.\n**Number of subscriptions on this account : \`${findSubs.length + 1}\`**`,
      }).catch((e) => {
        console.log(e);
      });
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
      client.users.cache.get("727498137232736306").send(`Bobot Sales has trouble in freetrial.js -\n\n${e}`);
    };
  }
}