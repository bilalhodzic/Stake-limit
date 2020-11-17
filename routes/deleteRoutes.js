const express = require("express");
const bodyParser = require("body-parser");
const {
  deleteTicket,
  deleteAllTickets,
} = require("../controllers/deleteQueries");

const router = express.Router();
router.use(bodyParser.json());

router.delete("/ticket/:id", (req, res) => {
  console.log(req.params);
  deleteTicket(req.params.id)
    .then((_) => {
      res.send("ticket deleted");
    })
    .catch((err) => {
      res.send(err.message);
    });
});

router.delete("/tickets", (req, res) => {
  deleteAllTickets()
    .then((_) => {
      res.send("ALl tickets deleted");
    })
    .catch((err) => {
      res.send(err.message);
    });
});

module.exports = router;
