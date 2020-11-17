const express = require("express");
const bodyParser = require("body-parser");
const {
  getAllDevices,
  getDeviceDetails,
  getAllTickets,
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

router.get("/tickets", (req, res) => {
  getAllTickets()
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

module.exports = router;
