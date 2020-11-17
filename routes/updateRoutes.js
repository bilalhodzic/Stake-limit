const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

router.put("/status", (req, res) => {
  console.log(req.body);
});

module.exports = router;
