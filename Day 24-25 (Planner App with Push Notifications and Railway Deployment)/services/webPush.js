// TBD Later
const webpush = require("web-push");

const publicKey =
  "BAZkLjpUJIrParwPRz90X0zpISPHEN0lyH2xSWK3Ka4Re3Fda4XAlznPTOoyd8DwVvDGY-5KH2X5adM2ejpFpeo";
const privateKey = "-0DknlbOzy4tKfb7K1VcwTYBnxe2hTDYEcHJ74VN9w4";

webpush.setVapidDetails("mailto:test@test.com", publicKey, privateKey);

module.exports = pushNotification = (notification, subscription) => {
  const subscription = {
    endpoint: notification.endpoint,
    expirationTime: null,
    keys: {
      p256dh: notification.p256dh,
      auth: notification.auth,
    },
  };
};
