const Redis = require("redis");

const RedisClient = Redis.createClient({
  host: "127.0.0.1",
  port: 6379,
  legacyMode: true,
});

module.exports = RedisClient;