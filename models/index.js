var mysql = require("mysql");

var con;

function connectDB() {
  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "stake-limit",
  });
  con.connect((err) => {
    if (err) console.log(err.message);
    console.log("connected");
  });
}

function insertTicket(ticket) {
  let sql = `insert into ticketmessage (serviceID, deviceID, stake, statusID)`;
}

function insertConfiguration(configuration) {
  connectDB();

  let sql = `insert into configuration (timeDuration, stakeLimit, hotPercentage, restrictionExpires) values(${configuration.timeDuration}, ${configuration.stakeLimit}, ${configuration.hotPercentage}, ${configuration.restrictionExpires})`;
  con.query(sql, (err, results, fields) => {
    if (err) throw err;
    console.log("1 record inserted");
  });

  con.end();
}

function getAllStatus() {
  connectDB();
  let sql = `select * from status`;

  con.query(sql, (err, res, fields) => {
    if (err) console.log(err.message);
    console.log("solution: ", res);
  });
  con.end();
}

module.exports = {
  insertTicket: insertTicket,
  insertConfiguration: insertConfiguration,
  getAllStatus: getAllStatus,
};
