require("dotenv").config({ path: "../.env" });
const File = require("../models/file");
const fs = require("fs");

let fetchAndDeleteData = async () => {
  const files = await File.find({
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }); // Get all documents older than 24 hours

  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync("../" + file.path);
        await file.remove();
        console.log(`Successfully deleted: ${file.filename}`);
      } catch (err) {
        console.log(`Error while deleting file: ${err} `);
      }
    }
  }

  console.log("All files older than 24 hours are deleted now");
};

module.exports = { fetchAndDeleteData };
