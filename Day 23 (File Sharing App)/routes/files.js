const router = require("express").Router();
const upload = require("../config/fileUpload");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/file");
const sendEmail = require("../services/email");
const emailTemplate = require("../utils/emailTemplate");
const BASE_URL = process.env.APP_BASE_URL;

//* @METHOD: POST
//* @DESCRIPTION: Upload file to server
router.post("/upload", (req, res) => {
  upload(req, res, async () => {
    try {
      if (!req.file) return res.json({ error: "File not selected" });

      // Upload file to db
      const file = new File({
        fileName: req.file.filename,
        uuid: uuidv4(),
        path: req.file.path,
        size: req.file.size,
      });

      const uploadedFile = await file.save();

      return res.status(200).json({
        file: `${BASE_URL}/api/pages/download-page/${uploadedFile.uuid}`,
      });
    } catch (err) {
      return res.status(500).send({ error: err.message }); //TODO convert send to json
    }
  });
});

//* @METHOD: GET
//* @DESCRIPTION: Download file from the server
router.get("/download/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file)
      return res.status(400).render("downloads", { error: "Link expired" });

    const filePath = `${__dirname}/../${file.path}`;
    return res.status(200).download(filePath);
  } catch (err) {
    return res.status(400).render("downloads", { error: err });
  }
});

//* @METHOD: POST
//* @DESCRIPTION: Send file through email
router.post("/send", async (req, res) => {
  try {
    const { uuid, receiversEmail, sendersEmail } = req.body;
    if (!(uuid && receiversEmail && sendersEmail)) {
      return res.status(422).send({
        error:
          "All fields are required - file, receiver's email and sender's email",
      }); //TODO convert send to json
    }

    const foundFile = await File.findOne({ uuid });
    // if (foundFile.receiver === receiversEmail) {
    //   return res.status(405).send({
    //     error: "Email already send",
    //   });
    // }

    foundFile.sender = sendersEmail;
    foundFile.receiver = receiversEmail;

    sendEmail({
      from: sendersEmail,
      to: receiversEmail,
      subject: "File shared to you through SharedSpace",
      text: `${sendersEmail} shared a file with you`,
      html: emailTemplate({
        emailFrom: sendersEmail,
        downloadLink: `${BASE_URL}/api/files/download/${foundFile.uuid}`,
        size: parseInt(foundFile.size / 1000) + " KB",
        expires: "24 hours",
      }),
    })
      .then(async () => {
        await foundFile.save();
        return res.status(200).json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: "Error in sending email." });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
