const Router = require("express").Router();
const { createSchedule } = require("../controllers/scheduleControllers");

const webPush = require("web-push");

const publicKey =
  "BAZkLjpUJIrParwPRz90X0zpISPHEN0lyH2xSWK3Ka4Re3Fda4XAlznPTOoyd8DwVvDGY-5KH2X5adM2ejpFpeo";
const privateKey = "-0DknlbOzy4tKfb7K1VcwTYBnxe2hTDYEcHJ74VN9w4";

const subscriberClient = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/c841Q8F0fjE:APA91bEFWHYMZeUUKoaGhzmReh-_mTuic3f-T6VMMhZ6QlEIPAIZNhIu626x-Otonsk7Sce0JBEkN3Z-Mw9UF6qTTbZUY1RAb7sRQLiaPnWSkG2Yeods8_00_rHA1CAeXpWAc3I5NM5N",
  expirationTime: null,
  keys: {
    p256dh:
      "BMHcNj8DHaAJ2oiyVc71ZqgUOf2O3-cIXJu46dMnbZ4qdq6qJxe9w3ojN5RJKkXMYlhaZc-Hn550U8bEsKU_o8s",
    auth: "8gXk-ID9s8DsfvIVNTX_Sw",
  },
};

webPush.setVapidDetails("mailto:test@test.com", publicKey, privateKey);

Router.route("/").post(createSchedule);

Router.route("/test").post((req, res) => {
  const { msg } = req.body;
  webPush.sendNotification(subscriberClient, msg);
  res.status(200).json({ msg: "Hello World" });
});

module.exports = Router;
