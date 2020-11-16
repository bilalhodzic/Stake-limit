const express = require("express");
const bodyParser = require("body-parser");
const stakeLimitService = require("../stakeLimitService");
const {
  insertConfiguration,
  insertTicket,
  getStatus,
  getDevice,
} = require("../controllers");
const { insertDevice } = require("../controllers/insertQueries");
const { getDeviceDetails } = require("../controllers/getQueries");
const { makeStartTime, addStakeToSum, checkRestrExpire } = require("../helper");

const router = express.Router();
router.use(bodyParser.json());
//- OK :: Ticket can be accepted, since no limit has been applied.
//- HOT :: Ticket can be accepted, but status serves as a warning that device
//is close to being blocked
//- BLOCKED :: Signals that device is blocked from accepting tickets

router.get("/", (req, res) => {
  res.send("Hello world");
});

var date = new Date();
var startTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

//default configuration for stake limit service

var defaultConf = {
  timeDuration: 1800, //30 min
  stakeLimit: 999,
  hotPercentage: 80,
  restrictionExpires: 300, //5 minutes
};

//make configuration for stake limit service based on stake from ticketmessage
const makeConf = (stake) => {
  console.log("makeCOnf not implemented yet...");
  // (defaultConf.timeDuration = stake.timeDuration),
  //   (defaultConf.stakeLimit = stake.stakeLimit),
  //   (defaultConf.hotPercentage = stake.hotPercentage),
  //   (defaultConf.restrictionExpires = stake.restrictionExpires);

  // insertConfiguration(defaultConf)
};

//endpoint which accept ticketMessage as payload
router.post("/sendTicket", (req, res) => {
  console.log(req.body);

  try {
    (async function () {
      //add received ticket to database

      //checks if device already exist--
      let device = await getDevice(req.body.deviceId);

      //console.log("device:", device);
      let date = new Date();

      //if there is no device already--insert it into database with configuration opt
      if (device === undefined) {
        makeConf(req.body.stake);

        insertDevice({
          deviceId: req.body.deviceId,
          startTime: makeStartTime(date),
          totalStake: req.body.stake,
        });
      }
      insertTicket(req.body, date);

      //if device exist check if it's blocked
      let status = await getStatus(req.body.deviceId);

      if (status.statusName === "BLOCKED") {
        if (checkRestrExpire(req.body.deviceId) === false) {
          res.status(200).send({ status: `${status.statusName}` });
        }
      }

      addStakeToSum(req.body);

      res.status(200).send({ status: `${status.statusName}` });
    })();
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/test", (req, res) => {
  (async function () {
    addStakeToSum("7d570ef0-0bef-41e9-baea-2535bd08b55f");

    res.send("tested");
  })();
});

//endpoint to configure stake limit service
router.post("/configure", (req, res) => {
  let error = null;
  if (req.body.timeDuration < 300 || req.body.timeDuration > 86400) {
    error = "Time duration must be between 300 and 86400 seconds";
  }
  if (req.body.stakeLimit < 1 || req.body.stakeLimit > 10000000) {
    error = "Stake limit must be a number between 1 and 10000000 ";
  }
  if (req.body.hotPercentage < 1 || req.body.hotPercentage > 100) {
    error = "Hot percentage must be a number between 1 and 100 ";
  }
  if (req.body.restrictionExpires < 60 && req.body.restrictionExpires !== 0) {
    error = "Restriction  must be more than 60 seconds";
  }

  if (!error) {
    try {
      insertConfiguration(req.body);
      res.send("okay");
    } catch (error) {
      res.send(error.message);
    }
  } else {
    res.send(error);
  }
  //console.log(req.body);
  //console.log(stakeLimitService);
});

/*
{
    "timeDuration": "500",
    "stakeLimit": "300",
    "hotPercentage": '60',
    "restrictionExpires": '300',

}
*/

module.exports = router;
