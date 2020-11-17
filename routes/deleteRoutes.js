const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

router.delete("/ticket/:id", (req, res) => {
  console.log(req.params);
});

module.exports = router;
