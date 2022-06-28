const {
  Client,
  Collection,
  Intents
} = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]
});

client.interactions = new Collection();

require('./handlers/events')(client);
require('./handlers/interactions')(client);

require('./databases/salesDB')();

process.on("unhandledRejection", (reason, p) => {
  console.log('[ ANTICRASH ] :: Unhandled Rejection / Catch');
  console.log(reason?.stack, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log('[ ANTICRASH ] :: Uncaught Exception / Catch');
  console.log(err?.stack, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log('[ ANTICRASH ] :: Uncaught Exception / Catch { MONITOR }');
  console.log(err?.stack, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log('[ ANTICRASH ] :: Multiple Resolves');
  console.log(type?.stack, promise, reason);
});

client.login(process.env['bot_token']);