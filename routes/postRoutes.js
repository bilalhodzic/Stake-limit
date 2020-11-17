const express = require("express");
const bodyParser = require("body-parser");

const {
  insertDevice,
  insertConfiguration,
  insertTicket,
} = require("../controllers/insertQueries");
const {
  getDeviceDetails,
  getStatus,
  getConfiguration,
} = require("../controllers/getQueries");
const {
  makeStartTime,
  addStakeToSum,
  checkRestrExpire,
  percentage,
  checkConfPayload,
  checkTicket,
} = require("../helper");
const {
  updateDeviceStatus,
  updateDeviceRestrTime,
  updateDeviceConf,
} = require("../controllers/updateQueries");

const router = express.Router();
router.use(bodyParser.json());

//endpoint which accept ticketMessage as payload
router.post("/sendTicket", (req, res) => {
  //using immediately invoked function expression to be able to use await in function
  (async function () {
    //check if the payload received is good
    let error = await checkTicket(req.body);
    if (error !== null) {
      console.log("Error: ", error);
      return res.status(200).send(error);
    }

    try {
      //checks if device already exist--
      let device = await getDeviceDetails(req.body.deviceId);

      let date = new Date();

      //if there is no device already--insert it into database with configuration opt
      if (device === undefined) {
        //insert configuration before device because we need serviceId as referenced key
        let configurationOpt = {
          timeDuration: 1800, //30 minutes
          stakeLimit: 1000,
          hotPercentage: 80, //80%
          restrictionExpires: 300, //5min
        };
        //check if sservice with given options already exists
        let configExist = await getConfiguration(configurationOpt);
        let service;

        if (!configExist) service = await insertConfiguration(configurationOpt);
        await insertDevice(
          {
            deviceId: req.body.deviceId,
            startTime: makeStartTime(date),
            totalStake: 0,
          },
          configExist ? configExist.serviceID : service.insertId
        );

        //we need to get device details again if device didn't exist previously
        device = await getDeviceDetails(req.body.deviceId);
      }

      //check status of device
      let status = await getStatus(req.body.deviceId);

      if (status.statusName === "BLOCKED") {
        //function will return false if restriction didn't expire
        if ((await checkRestrExpire(req.body.deviceId)) === false) {
          console.log("restriction didnt expire");

          //if restriction did't expire--delete saved ticked from database
          //deleteTicket(req.body.id);
          return res.status(200).send({ status: `${status.statusName}` });
        }

        //need to update device status if restriction expired
        //updateDeviceStatus(req.body.deviceId, "OK");
        status.statusName = "OK";
      }

      //add received stake to totalStake of device
      let totalStake = await addStakeToSum(req.body, date);

      //stake limit where status HOT is sent
      let hotLimit = percentage(device.hotPercentage, device.stakeLimit);
      if (totalStake >= device.stakeLimit) {
        status.statusName = "BLOCKED";
        //update device status in database
        await updateDeviceStatus(req.body.deviceId, "BLOCKED");

        //insert start of restriction counting time to device in db
        await updateDeviceRestrTime(req.body.deviceId, makeStartTime(date));
      } else if (totalStake >= hotLimit) {
        status.statusName = "HOT";
        await updateDeviceStatus(req.body.deviceId, "HOT");
      }

      //if all the conditions were ok
      //insert ticket in db when ticket message is received
      await insertTicket(req.body, makeStartTime(date));

      return res.status(200).send({ status: status.statusName });
    } catch (err) {
      console.log("Error: ", err.message);
      res.send(err.message);
    }
  })();
});

//endpoint to configure stake limit service
router.post("/configure", (req, res) => {
  let error = null;
  error = checkConfPayload(req.body);

  if (!error) {
    //check if same configurations already exist
    getConfiguration(req.body).then((exist) => {
      if (!exist) {
        insertConfiguration(req.body)
          .then((_) => {
            res.send("Configuration added");
          })
          .catch((err) => {
            res.send(err.message);
          });
      } else {
        res.send("Same configuration already exist");
      }
    });
  } else {
    res.send(error);
  }
});

/* --configuration--
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
    getConfiguration(req.body).then((exist) => {
      if (!exist) {
        insertConfiguration(req.body)
          .then((service) => {
            updateDeviceConf(req.params.deviceId, service.insertId);
            res.send("Configuration updated");
          })
          .catch((err) => {
            res.send(err.message);
          });
      } else {
        updateDeviceConf(req.params.deviceId, exist.serviceID);
        res.send("Same configuration already exist");
      }
    });
  } else {
    res.send(error);
  }
});

module.exports = router;
