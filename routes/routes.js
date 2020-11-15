const express = require("express");
const bodyParser = require("body-parser");
const stakeLimitService = require("../stakeLimitService");
const { insertConfiguration } = require("../models");

const router = express.Router();
router.use(bodyParser.json());

//- OK :: Ticket can be accepted, since no limit has been applied.
//- HOT :: Ticket can be accepted, but status serves as a warning that device
//is close to being blocked
//- BLOCKED :: Signals that device is blocked from accepting tickets
const status = ["OK", "HOT", "BLOCKED"];

router.get("/", (req, res) => {
  res.send("Hello world");
});

router.post("/sendTicket", (req, res) => {
  console.log(req.body);

  res.status(200).send({ status: `${status[0]}` });
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
