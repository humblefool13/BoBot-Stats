const mongoose = require("mongoose");

const format = {
  number: Number,
  discord_id: String,
  server_id: String,
  sale_channel: String,
  list_channel: String,
  sales_webhook_id: String,
  listings_webhook_id: String,
  chain: String,
  opensea_slug: String,
  magiceden_symbol: String,
  contract_address: String,
  collection_name: String,
  collection_pfp: String,
  big: Boolean,
  stats_channel: String,
  stats_webhook_id: String,
  stats_webhook_message_id: String,
  expired: Boolean,
  expired_timestamp: Number,
};

module.exports = mongoose.model('configurationRecords', format);