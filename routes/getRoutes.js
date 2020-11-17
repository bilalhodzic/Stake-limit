const express = require("express");
const bodyParser = require("body-parser");
const {
  getAllDevices,
  getDeviceDetails,
} = require("../controllers/getQueries");

const router = express.Router();
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Hello world");
});

//get all details of device
router.get("/device/:id", (req, res) => {
  getDeviceDetails(req.params.id)
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

//get all devices from database
router.get("/device", (req, res) => {
  getAllDevices()
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

router.get("/test", (req, res) => {
  (async function () {
    updateDeviceStatus("7d570ef0-0bef-41e9-baea-2535bd08b55f", "OK");

    res.send("tested");
  })();
});

module.exports = router;
