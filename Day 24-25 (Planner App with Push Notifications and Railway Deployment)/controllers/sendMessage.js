const { getQuote } = require("../utils/randomQuoteGenerator");
const RedisClient = require("../config/connectRedis");
const webpush = require("web-push");

// ["0",   "1",   "2",   "3",   "4",   "5",   "6",   "7",   "8"]
// [ 9-10, 10-11, 11-12, 12-13, 13-14, 14-15, 15-16, 16-17, 17-18]

const sendMessage = async () => {
  let date = new Date();
  let minutes = date.getMinutes();
  let hour = date.getHours();

  const schedule = await RedisClient.get("schedule");
  const subscriberClient = await RedisClient.get("subscriberClient");

  const parsedSchedule = JSON.parse(schedule);
  const parsedSubscriberClient = JSON.parse(subscriberClient);

  const index = hour - 9;

  let message = "";

  if (minutes === 30) {
    // send quote
    message = getQuote();
    console.log(message);
  } else {
    if (index - 1 >= 0) {
      // get schedule at index
      // remember at a time there would be something ending and next thing starting
      // check if last task is completed and next task is starting
      // mesage: It's time to start ${schedule[index]} task was ${schedule[index-1]} completed?
      message = `It's time to start ${parsedSchedule[index]} task was ${
        parsedSchedule[index - 1]
      } completed?`;
      console.log(message);
    } else if (index === 0) {
      message = `It's time to start ${parsedSchedule[index]}`;
      console.log(message);
    }
  }

  /*
  webpush
      .sendNotification(
        subscription,
        JSON.stringify({
          title: "Planner App",
          body: "This is your first push notification",
        })
      )
      .catch(console.log);
 */
  webpush
    .sendNotification(
      parsedSubscriberClient,
      JSON.stringify({
        title: "Planner App",
        body: message,
      })
    )
    .catch(console.log);
};

module.exports = { sendMessage };
