const express = require('express');
const router = express.Router();
const Url = require('../models/urlModel')
const createDB = require('../config/db');

//nanoid(version-3) creates unique id (you can use uuid and short id)
const { nanoid } = require('nanoid');

//add baseUrl as url of website where you host the website + /urlapi
//baseUrl is http://localhost:PORT/urlapi/ when running locally

const baseUrl = 'http://localhost:3000/urlapi/'

//connecting databse
createDB.sync().then(() => console.log('now you can store the data'));




//post request 
router.post("/", async (req, res) => {
  try {
    const { longUrl } = req.body;
    const shortId = baseUrl+nanoid(4);
    //inserting values 
    const storeUrl = await Url.create({
      longUrl: longUrl,
      shortUrl: shortId,
    });
    //sending response if its success
    return res.status(200).json({
      status: "ok",
      shortUrl: storeUrl.shortUrl,
    });
  } catch (err) {
    console.log(err);
    return res.send(err.message);
  }
});

//get request 
router.get('/:short', async (req, res) => {
  let shortId=req.params.short
  //find a values using where
  let url = await Url.findOne({
    where: {
      shortUrl: `${baseUrl}${shortId}`
    }
  });
  if(!url){
    res.status(404).send("Enter valid code")
  }
  res.redirect(url.longUrl)
}
  )
module.exports = router;