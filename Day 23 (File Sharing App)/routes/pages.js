const router = require("express").Router();
const File = require("../models/file");
const BASE_URL = process.env.APP_BASE_URL;

//* @METHOD: GET
//* @DESCRIPTION: Display Download Page
//TODO Find a better way to file routing and displaying download page
router.get("/download-page/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file)
      return res.status(400).render("downloads", { error: "Link expired" });

    return res.status(200).render("downloads", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${BASE_URL}/api/files/download/${file.uuid}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).render("downloads", { error: err.message });
  }
});

module.exports = router;
