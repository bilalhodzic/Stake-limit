var mysql = require("mysql");
const { insertTicket, insertConfiguration } = require("./insertQueries");
const { getAllStatus, getStatus, getDevice } = require("./getQueries");
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

function execQuery(sql, message) {
  connectDB();
  con.query(sql, (err, results, fields) => {
    if (err) throw err;
    console.log(message);
  });

  con.end();
}

module.exports = {
  insertTicket: insertTicket,
  insertConfiguration: insertConfiguration,
  getAllStatus: getAllStatus,
  getStatus: getStatus,
  getDevice: getDevice,
};
