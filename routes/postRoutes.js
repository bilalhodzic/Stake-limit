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
      let status = { statusName: "OK" };
      let wasBlocked = false;

      let date = new Date();

      //if there is no device already--insert it into database with configuration opt
      if (device === undefined) {
        //insert configuration before device because we need serviceId as referenced key
        let configurationOpt = {
          timeDuration: 600, //10 minutes
          stakeLimit: 1000,
          hotPercentage: 80, //80%
          restrictionExpires: 300, //5min
        };
        //check if sservice with given options already exists
        let configExist = await getConfiguration(configurationOpt);
        let service;

        if (configExist === undefined)
          service = await insertConfiguration(configurationOpt);

        await insertDevice(
          {
            deviceId: req.body.deviceId,
            startTime: makeStartTime(date),
            totalStake: 0,
          },
          configExist !== undefined ? configExist.serviceID : service.insertId
        );

        //we need to get device details again if device didn't exist previously
        device = await getDeviceDetails(req.body.deviceId);
      } else {
        //check status of device
        status = await getStatus(req.body.deviceId);

        if (status.statusName === "BLOCKED") {
          //function will return false if restriction didn't expire
          if ((await checkRestrExpire(req.body.deviceId)) === false) {
            console.log("restriction didnt expire");

            return res.status(200).send({ status: `${status.statusName}` });
          }

          //need to update device status if restriction expired
          wasBlocked = true;
          status.statusName = "OK";
        }
      }

      //add received stake to totalStake of device
      let totalStake = await addStakeToSum(req.body, date);

      //stake limit where status HOT is sent
      let hotLimit = percentage(device.hotPercentage, device.stakeLimit);
      if (totalStake >= device.stakeLimit) {
        status.statusName = "BLOCKED";

        //insert start of restriction counting time to device in db
        await updateDeviceRestrTime(req.body.deviceId, makeStartTime(date));
      } else if (totalStake >= hotLimit) {
        status.statusName = "HOT";
      }

      //if all the conditions were ok
      //insert ticket in db when ticket message is received
      await insertTicket(req.body, makeStartTime(date));

      //update device status only if it's changed
      if (wasBlocked && status.statusName === "OK") {
        await updateDeviceStatus(req.body.deviceId, status.statusName);
      } else if (status.statusName !== "OK") {
        await updateDeviceStatus(req.body.deviceId, status.statusName);
      }

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

//endpoint to add new device
// ------{"deviceId": "9b9bf7df-cd65-452f-b6cc-48bf40319c84"}---
router.post("/device", (req, res) => {
  let validUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;

  (async function () {
    let device = await getDeviceDetails(req.body.deviceId);

    if (req.body.deviceId === undefined || !validUUID.test(req.body.deviceId)) {
      return res.send("deviceId is not valid");
    }
    if (device !== undefined) {
      return res.send("Device with same id already exist");
    }
    let date = new Date();

    let configurationOpt = {
      timeDuration: 600, //10 minutes
      stakeLimit: 1000,
      hotPercentage: 80, //80%
      restrictionExpires: 300, //5min
    };

    try {
      //check if sservice with given options already exists
      let configExist = await getConfiguration(configurationOpt);
      let service;

      if (configExist === undefined)
        service = await insertConfiguration(configurationOpt);

      await insertDevice(
        {
          deviceId: req.body.deviceId,
          startTime: makeStartTime(date),
          totalStake: 0,
        },
        configExist !== undefined ? configExist.serviceID : service.insertId
      );
      res.send(`Device added with id: ${req.body.deviceId}`);
    } catch (error) {
      console.log("Error: ", error.message);
      res.send(error.message);
    }
  })();
});

//add configuration with defined payload to device
router.post("/configure/:deviceId", (req, res) => {
  let error = checkConfPayload(req.body);

  if (!error) {
    getConfiguration(req.body).then((exist) => {
      if (!exist) {
        insertConfiguration(req.body)
          .then((service) => {
            updateDeviceConf(req.params.deviceId, service.insertId).catch(
              (err) => {
                res.send(err.message);
              }
            );
            res.send("Configuration updated");
          })
          .catch((err) => {
            res.send(err.message);
          });
      } else {
        updateDeviceConf(req.params.deviceId, exist.serviceID).catch((err) => {
          res.send(err.message);
        });
        res.send("Same configuration already exist");
      }
    });
  } else {
    res.send(error);
  }
});

module.exports = router;
