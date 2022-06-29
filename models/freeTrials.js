const mongoose = require("mongoose");

const format = {
  discord_id: String,
};

module.exports = mongoose.model('freeTrials', format);