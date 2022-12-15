const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/',async(req,res)=>{
  const htmlPath =path.join(__dirname,'public','index.html');
  res.sendFile(htmlPath);
})
module.exports = router;