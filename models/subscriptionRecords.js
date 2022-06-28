const mongoose = require("mongoose");

const format = {
  discord_id: String,
  start_timestamp: Number,
  months: Number,
  end_timestamp: Number,
  number: Number,
};

module.exports = mongoose.model('subscriptionRecords', format);