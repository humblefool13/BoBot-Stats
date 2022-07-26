const config_records = require('../models/configurations');
const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const { RateLimiter } = require("limiter");
const limiter_OS_poly = new RateLimiter({
  tokensPerInterval: 1,
  interval: "second",
  fireImmediately: true
});
const limiter_OS_eth = new RateLimiter({
  tokensPerInterval: 1,
  interval: "second",
  fireImmediately: true
});
const limiter_OS_klay = new RateLimiter({
  tokensPerInterval: 1,
  interval: "second",
  fireImmediately: true
});
const limiter_OS_sol = new RateLimiter({
  tokensPerInterval: 1,
  interval: "second",
  fireImmediately: true
});
const limiter_ME = new RateLimiter({
  tokensPerInterval: 2,
  interval: "second",
  fireImmediately: true
});
const limiter_LR = new RateLimiter({
  tokensPerInterval: 2,
  interval: "second",
  fireImmediately: true
});
const limiter_XY = new RateLimiter({
  tokensPerInterval: 4,
  interval: "second",
  fireImmediately: true
});
const PriceUrl = "https://api.coingecko.com/api/v3/simple/price?ids=solana%2Cklay-token&vs_currencies=eth";
let sol_eth = 0;
let klay_eth = 0;

/////////////////////////////////////////////

async function getStatsPoly(collection_slug) {
  const remainingRequests = await limiter_OS_poly.removeTokens(1);
  if (remainingRequests < 0) return;
  const url = `https://api.opensea.io/api/v1/collection/${collection_slug}/stats`
  const result = await fetch(url);
  const response = await result.json();
  return response;
};
async function getStatsKlay(collection_slug) {
  const remainingRequests = await limiter_OS_klay.removeTokens(1);
  if (remainingRequests < 0) return;
  const url = `https://api.opensea.io/api/v1/collection/${collection_slug}/stats`
  const result = await fetch(url);
  const response = await result.json();
  return response;
};
async function getStatsEth(collection_slug) {
  const remainingRequests = await limiter_OS_eth.removeTokens(1);
  if (remainingRequests < 0) return;
  const url = `https://api.opensea.io/api/v1/collection/${collection_slug}/stats`
  const result = await fetch(url);
  const response = await result.json();
  return response;
};
async function getStatsSol(collection_slug) {
  const remainingRequests = await limiter_OS_sol.removeTokens(1);
  if (remainingRequests < 0) return;
  const url = `https://api.opensea.io/api/v1/collection/${collection_slug}/stats`
  const result = await fetch(url);
  const response = await result.json();
  return response;
};
async function getStatsME(symbol) {
  const remainingRequests = await limiter_ME.removeTokens(1);
  if (remainingRequests < 0) return;
  const url = `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`
  const result = await fetch(url);
  const response = await result.json();
  return response;
};
async function getStatsEthLR(address) {
  const remainingRequests = await limiter_LR.removeTokens(1);
  if (remainingRequests < 0) return;
  const url = `https://api.looksrare.org/api/v1/collections/stats?address=${address}`;
  const result = await fetch(url);
  const response = await result.json();
  return response;
};
async function getStatsEthXY(address) {
  const remainingRequests = await limiter_XY.removeTokens(1);
  if (remainingRequests < 0) return;
  const options = {
    headers: {
      accept: 'application/json',
      'X-API-Key': process.env["x2y2_key"],
    },
    method: "GET"
  };
  const url = `https://api.x2y2.org/v1/contracts/${address}/stats`;
  const result = await fetch(url, options);
  const response = await result.json();
  return response;
};
async function updatePrices() {
  const result = await fetch(PriceUrl);
  const response = await result.json();
  if (!response.solana) return;
  sol_eth = response.solana.eth;
  klay_eth = response["klay-token"].eth;
};
////////////////////////////////////////////

function embedPoly(stats, slug, cname, pic) {
  const embed = new EmbedBuilder()
    .setTitle(`${cname} | Live Stats`)
    .setURL(`https://opensea.io/collection/${slug}`)
    .setThumbnail(pic)
    .setTimestamp()
    .setColor("Random")
    .setFooter({ text: 'Powered by BoBot', iconURL: 'https://media.discordapp.net/attachments/797163839765741568/969482807678234725/unknown-1.png?width=452&height=452' })
    .addFields([
      { name: `Floor Price`, value: `${stats.floor_price}<:matic:997764149746610256>`, inline: true },
      { name: `Average Price`, value: `${stats.average_price.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Total Sales`, value: `${stats.total_sales}`, inline: true },
      { name: `Market Cap`, value: `${stats.market_cap.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Total Volume`, value: `${stats.total_volume.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Unique Hodlers`, value: `${stats.num_owners}`, inline: true },
      { name: `Sales 1D`, value: `${stats.one_day_sales}`, inline: true },
      { name: `Sales 7D`, value: `${stats.seven_day_sales}`, inline: true },
      { name: `Sales 30D`, value: `${stats.thirty_day_sales}`, inline: true },
      { name: `Avg. Price 1D`, value: `${stats.one_day_average_price.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Avg. Price 7D`, value: `${stats.seven_day_average_price.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Avg. Price 30D`, value: `${stats.thirty_day_average_price.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Volume 1D`, value: `${stats.one_day_volume.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Volume 7D`, value: `${stats.seven_day_volume.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Volume 30D`, value: `${stats.thirty_day_volume.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Change 1D`, value: `${stats.one_day_change.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Change 7D`, value: `${stats.seven_day_change.toFixed(4)}<:matic:997764149746610256>`, inline: true },
      { name: `Change 30D`, value: `${stats.thirty_day_change.toFixed(4)}<:matic:997764149746610256>`, inline: true },
    ]);
  return embed;
};
function embedKlay(stats, slug, cname, pic) {
  const embed = new EmbedBuilder()
    .setTitle(`${cname} | Live Stats`)
    .setURL(`https://opensea.io/collection/${slug}`)
    .setThumbnail(pic)
    .setTimestamp()
    .setColor("Random")
    .setFooter({ text: 'Powered by BoBot', iconURL: 'https://media.discordapp.net/attachments/797163839765741568/969482807678234725/unknown-1.png?width=452&height=452' })
    .addFields([
      { name: `Floor Price`, value: `${(stats.floor_price / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Average Price`, value: `${(stats.average_price / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Total Sales`, value: `${stats.total_sales}`, inline: true },
      { name: `Market Cap`, value: `${(stats.market_cap / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Total Volume`, value: `${(stats.total_volume / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Unique Hodlers`, value: `${stats.num_owners}`, inline: true },
      { name: `Sales 1D`, value: `${stats.one_day_sales}`, inline: true },
      { name: `Sales 7D`, value: `${stats.seven_day_sales}`, inline: true },
      { name: `Sales 30D`, value: `${stats.thirty_day_sales}`, inline: true },
      { name: `Avg. Price 1D`, value: `${(stats.one_day_average_price / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Avg. Price 7D`, value: `${(stats.seven_day_average_price / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Avg. Price 30D`, value: `${(stats.thirty_day_average_price / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Volume 1D`, value: `${(stats.one_day_volume / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Volume 7D`, value: `${(stats.seven_day_volume / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Volume 30D`, value: `${(stats.thirty_day_volume / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Change 1D`, value: `${(stats.one_day_change / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Change 7D`, value: `${(stats.seven_day_change / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
      { name: `Change 30D`, value: `${(stats.thirty_day_change / klay_eth).toFixed(4)}<:klay:997764302071148564>`, inline: true },
    ]);
  return embed;
};
function embedEth(stats, slug, name, pic, lrfp, xyfp) {
  const fplr = parseFloat((lrfp / Math.pow(10, 18)).toFixed(4));
  const fpxy = parseFloat((xyfp / Math.pow(10, 18)).toFixed(4));
  const embed = new EmbedBuilder()
    .setTitle(`${name} | Live Stats`)
    .setURL(`https://opensea.io/collection/${slug}`)
    .setThumbnail(pic)
    .setTimestamp()
    .setColor("Random")
    .setFooter({ text: 'Powered by BoBot', iconURL: 'https://media.discordapp.net/attachments/797163839765741568/969482807678234725/unknown-1.png?width=452&height=452' })
    .addFields([
      { name: `Floor Prices`, value: `<:OpenSeaLogo:990321456263098398> : ${stats.floor_price}<:ethereum:997764237025890318>`, inline: true },
      { name: '\u200B', value: `<:looksblack:990321530510643340> : ${fplr}<:ethereum:997764237025890318>`, inline: true },
      { name: '\u200B', value: `<:x2y2:992453235610755092> : ${fpxy}<:ethereum:997764237025890318>`, inline: true },
      { name: `Total Supply`, value: `${stats.total_supply}`, inline: true },
      { name: `Average Price`, value: `${stats.average_price.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Total Sales`, value: `${stats.total_sales}`, inline: true },
      { name: `Market Cap`, value: `${stats.market_cap.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Total Volume`, value: `${stats.total_volume.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Unique Hodlers`, value: `${stats.num_owners}`, inline: true },
      { name: `Sales 1D`, value: `${stats.one_day_sales}`, inline: true },
      { name: `Sales 7D`, value: `${stats.seven_day_sales}`, inline: true },
      { name: `Sales 30D`, value: `${stats.thirty_day_sales}`, inline: true },
      { name: `Avg. Price 1D`, value: `${stats.one_day_average_price.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Avg. Price 7D`, value: `${stats.seven_day_average_price.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Avg. Price 30D`, value: `${stats.thirty_day_average_price.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Volume 1D`, value: `${stats.one_day_volume.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Volume 7D`, value: `${stats.seven_day_volume.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Volume 30D`, value: `${stats.thirty_day_volume.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Change 1D`, value: `${stats.one_day_change.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Change 7D`, value: `${stats.seven_day_change.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
      { name: `Change 30D`, value: `${stats.thirty_day_change.toFixed(4)}<:ethereum:997764237025890318>`, inline: true },
    ]);
  return embed;
};
function embedSol(stats, meFP, slug, name, pic) {
  const fpMe = parseFloat((meFP / Math.pow(10, 9)).toFixed(4));
  const embed = new EmbedBuilder()
    .setTitle(`${name} | Live Stats`)
    .setURL(`https://opensea.io/collection/${slug}`)
    .setThumbnail(pic)
    .setTimestamp()
    .setColor("Random")
    .setFooter({ text: 'Powered by BoBot', iconURL: 'https://media.discordapp.net/attachments/797163839765741568/969482807678234725/unknown-1.png?width=452&height=452' })
    .addFields([
      { name: `Floor Prices`, value: `<:OpenSeaLogo:990321456263098398> : ${(stats.floor_price / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: '\u200B', value: `<:magicEden:990321805665374278> : ${fpMe}<:sol:997764346887278623>`, inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: `Total Supply`, value: `${stats.total_supply}`, inline: true },
      { name: `Average Price`, value: `${(stats.average_price / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Total Sales`, value: `${stats.total_sales}`, inline: true },
      { name: `Market Cap`, value: `${(stats.market_cap / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Total Volume`, value: `${(stats.total_volume / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Unique Hodlers`, value: `${stats.num_owners}`, inline: true },
      { name: `Sales 1D`, value: `${stats.one_day_sales}`, inline: true },
      { name: `Sales 7D`, value: `${stats.seven_day_sales}`, inline: true },
      { name: `Sales 30D`, value: `${stats.thirty_day_sales}`, inline: true },
      { name: `Avg. Price 1D`, value: `${(stats.one_day_average_price / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Avg. Price 7D`, value: `${(stats.seven_day_average_price / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Avg. Price 30D`, value: `${(stats.thirty_day_average_price / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Volume 1D`, value: `${(stats.one_day_volume / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Volume 7D`, value: `${(stats.seven_day_volume / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Volume 30D`, value: `${(stats.thirty_day_volume / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Change 1D`, value: `${(stats.one_day_change / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Change 7D`, value: `${(stats.seven_day_change / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
      { name: `Change 30D`, value: `${(stats.thirty_day_change / sol_eth).toFixed(4)}<:sol:997764346887278623>`, inline: true },
    ]);
  return embed;
};

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log("!!!!! BOBOT SALES [STATS] IS ON !!!!!");
    await updatePrices();
    setInterval(updatePrices, 1000 * 60 * 2);

    //////////////////////////////////////////////////////////////////////////////

    let collections_poly, collections_eth, collections_klay, collections_sol;
    async function updateCollections() {
      collections_poly = await config_records.find({
        expired: false,
        chain: "MATIC",
      });
      collections_eth = await config_records.find({
        expired: false,
        chain: "ETH",
      });
      collections_klay = await config_records.find({
        expired: false,
        chain: "KLAY",
      });
      collections_sol = await config_records.find({
        expired: false,
        chain: "SOL",
      });
    };
    await updateCollections();
    setInterval(updateCollections, 1000 * 60 * 2);

    ////////////////////////////////////////////////////////////////////////////////////

    async function updatePoly() {
      collections_poly.forEach(async (collection) => {
        if (collection.stats_channel === "NA") return;
        const name = collection.collection_name;
        const pic = collection.collection_pfp;
        const slug = collection.opensea_slug;
        let stats;
        do {
          stats = await getStatsPoly(slug);
        } while (!stats || !stats?.stats);
        const embed = embedPoly(stats.stats, slug, name, pic);
        const channel = await client.guilds.cache.get(collection.server_id).channels.fetch(collection.stats_channel);
        const webhooks = await channel.fetchWebhooks();
        webhooks.each((webhook) => {
          if (webhook.id !== collection.stats_webhook_id) return;
          webhook.editMessage(collection.stats_webhook_message_id, {
            content: null,
            username: name,
            avatarURL: pic,
            embeds: [embed],
          });
        });
      });
    };
    await updatePoly();
    setInterval(updatePoly, 1000 * 60 * 2);

    ////////////////////////////////////////////////////////////////////////////////////

    async function updateKlay() {
      collections_klay.forEach(async (collection) => {
        if (collection.stats_channel === "NA") return;
        const name = collection.collection_name;
        const pic = collection.collection_pfp;
        const slug = collection.opensea_slug;
        let stats;
        do {
          stats = await getStatsKlay(slug);
        } while (!stats || !stats?.stats);
        const embed = embedKlay(stats.stats, slug, name, pic);
        const channel = await client.guilds.cache.get(collection.server_id).channels.fetch(collection.stats_channel);
        const webhooks = await channel.fetchWebhooks();
        webhooks.each((webhook) => {
          if (webhook.id !== collection.stats_webhook_id) return;
          webhook.editMessage(collection.stats_webhook_message_id, {
            content: null,
            username: name,
            avatarURL: pic,
            embeds: [embed],
          });
        });
      });
    };
    await updateKlay();
    setInterval(updateKlay, 1000 * 60 * 2);

    ////////////////////////////////////////////////////////////////////////////////////

    async function updateEth() {
      collections_eth.forEach(async (collection) => {
        if (collection.stats_channel === "NA") return;
        const name = collection.collection_name;
        const pic = collection.collection_pfp;
        const slug = collection.opensea_slug;
        let statsOS, statsLR, statsXY;
        do {
          statsOS = await getStatsEth(slug);
        } while (!statsOS || !statsOS?.stats);
        do {
          statsLR = await getStatsEthLR(collection.contract_address);
        } while (!statsLR || !statsLR?.success);
        do {
          statsXY = await getStatsEthXY(collection.contract_address);
        } while (!statsXY || !statsXY?.success);
        const embed = embedEth(statsOS.stats, slug, name, pic, Number(statsLR.data.floorPrice), Number(statsXY.data.floor_price));
        const channel = await client.guilds.cache.get(collection.server_id).channels.fetch(collection.stats_channel);
        const webhooks = await channel.fetchWebhooks();
        webhooks.each((webhook) => {
          if (webhook.id !== collection.stats_webhook_id) return;
          webhook.editMessage(collection.stats_webhook_message_id, {
            content: null,
            username: name,
            avatarURL: pic,
            embeds: [embed],
          });
        });
      });
    };
    await updateEth();
    setInterval(updateEth, 1000 * 60 * 2);

    ////////////////////////////////////////////////////////////////////////////////////

    async function updateSol() {
      collections_sol.forEach(async (collection) => {
        if (collection.stats_channel === "NA") return;
        const name = collection.collection_name;
        const pic = collection.collection_pfp;
        const slug = collection.opensea_slug;
        const symbol = collection.magiceden_symbol;
        let statsOS, statsME;
        do {
          statsOS = await getStatsSol(slug);
        } while (!statsOS || !statsOS?.stats);
        do {
          statsME = await getStatsME(symbol);
        } while (!statsME || !statsME?.symbol);
        const embed = embedSol(statsOS.stats, statsME.floorPrice, slug, name, pic);
        const channel = await client.guilds.cache.get(collection.server_id).channels.fetch(collection.stats_channel);
        const webhooks = await channel.fetchWebhooks();
        webhooks.each((webhook) => {
          if (webhook.id !== collection.stats_webhook_id) return;
          webhook.editMessage(collection.stats_webhook_message_id, {
            content: null,
            username: name,
            avatarURL: pic,
            embeds: [embed],
          });
        });
      });
    };
    await updateSol();
    setInterval(updateSol, 1000 * 60 * 2);
  },
};