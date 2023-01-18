const scheduler = require("node-cron");
const { sendMessage } = require("../controllers/sendMessage");

const options = {
  scheduled: false,
  timezone: "Asia/Kolkata",
};

const job = scheduler.schedule("*/30 * * * *", sendMessage, options);

scheduler.schedule("0 9 * * * *", () => {
  job.start();
});

scheduler.schedule("0 20 * * *", () => {
  job.stop();
});
