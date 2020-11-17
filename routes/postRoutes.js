const express = require("express");
const bodyParser = require("body-parser");
const {
  insertConfiguration,
  insertTicket,
  getStatus,
  getDevice,
} = require("../controllers");
const { insertDevice } = require("../controllers/insertQueries");
const { getDeviceDetails } = require("../controllers/getQueries");
const {
  makeStartTime,
  addStakeToSum,
  checkRestrExpire,
  percentage,
  checkConfPayload,
} = require("../helper");
const {
  updateDeviceStatus,
  updateDeviceStartTime,
  updateDeviceRestrTime,
  updateDeviceConf,
} = require("../controllers/updateQueries");
const { deleteTicket } = require("../controllers/deleteQueries");

const router = express.Router();
router.use(bodyParser.json());

//endpoint which accept ticketMessage as payload
router.post("/sendTicket", (req, res) => {
  //console.log(req.body);

  try {
    (async function () {
      //add received ticket to database

      //checks if device already exist--
      let device = await getDeviceDetails(req.body.deviceId);

      //console.log("device:", device);
      let date = new Date();

      let InsertedDevice = false;
      //if there is no device already--insert it into database with configuration opt
      if (device === undefined) {
        await insertDevice({
          deviceId: req.body.deviceId,
          startTime: makeStartTime(date),
          totalStake: req.body.stake,
        });
        device = await getDeviceDetails(req.body.deviceId);
        InsertedDevice = true;
      }

      await InsertedDevice;
      //insert ticket in db when ticket message is received
      insertTicket(req.body, date);

      //if device exist check if it's blocked
      let status = await getStatus(req.body.deviceId);

      //if it's still blocked return status BLOCKED
      if (status.statusName === "BLOCKED") {
        //function will return false if restriction didn't expire
        if ((await checkRestrExpire(req.body.deviceId)) === false) {
          console.log("restriction didnt expire");

          //if restriction did't expire--delete saved ticked from database
          deleteTicket(req.body.id);
          return res.status(200).send({ status: `${status.statusName}` });
        }

        //need to update device status if restriction expired
        updateDeviceStatus(req.body.deviceId, "OK");
      }

      //add received stake to totalStake of device
      let totalStake = await addStakeToSum(req.body, date);

      //stake limit where status HOT is sent
      let hotLimit = percentage(device.hotPercentage, device.stakeLimit);
      if (totalStake >= device.stakeLimit) {
        updateDeviceStatus(req.body.deviceId, "BLOCKED");

        //insert start of restriction counting time to device in db
        updateDeviceRestrTime(req.body.deviceId, makeStartTime(date));

        return res.status(200).send({ status: `BLOCKED` });
      } else if (totalStake >= hotLimit) {
        updateDeviceStatus(req.body.deviceId, "HOT");

        return res.status(200).send({ status: `HOT` });
      }

      //if all the conditions were ok
      res.status(200).send({ status: `OK` });
    })();
  } catch (err) {
    res.send(err.message);
  }
});

//endpoint to configure stake limit service
router.post("/configure", (req, res) => {
  let error = null;
  error = checkConfPayload(req.body);

  if (!error) {
    insertConfiguration(req.body)
      .then((service) => {
        res.send("Configuration added");
      })
      .catch((err) => {
        res.send(err.message);
      });
  } else {
    res.send(error);
  }
});

/*
{
    "timeDuration": "500",
    "stakeLimit": "300",
    "hotPercentage": '60',
    "restrictionExpires": '300',

}
*/

//add configuration with defined payload to device
router.post("/configure/:deviceId", (req, res) => {
  let error = checkConfPayload(req.body);

  if (!error) {
    insertConfiguration(req.body)
      .then((service) => {
        updateDeviceConf(req.params.deviceId, service.insertId);
        res.send("Configuration updated");
      })
      .catch((err) => {
        res.send(err.message);
      });
  } else {
    res.send(error);
  }
});

module.exports = router;
