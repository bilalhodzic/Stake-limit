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

//insert ticket to database
function insertTicket(ticket, date) {
  //var date = new Date();
  //var startTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  var fullDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  let sql = `insert into ticketmessage (id, deviceId, stake,  sendTime) values('${ticket.id}', '${ticket.deviceId}', ${ticket.stake}, '${fullDate}')`;
  connectDB();
  con.query(sql, (err, results, fields) => {
    if (err) return console.error(err.message);
    console.log("1 ticketMessage  record inserted");
  });

  con.end();
}

//insert a new device into database
function insertDevice(device) {
  let sql = `insert into device (deviceId, statusId,  serviceId, totalStake,startTime) values('${device.deviceId}', 1, 2, ${device.totalStake}, '${device.startTime}')`;
  connectDB();
  con.query(sql, (err, results, fields) => {
    if (err) return console.error(err.message);
    console.log("1 device  record inserted");
  });

  con.end();
}

function insertConfiguration(configuration) {
  connectDB();

  let sql = `insert into configuration (timeDuration, stakeLimit, hotPercentage, restrictionExpires) values(${configuration.timeDuration}, ${configuration.stakeLimit}, ${configuration.hotPercentage}, ${configuration.restrictionExpires})`;
  con.query(sql, (err, results, fields) => {
    if (err) throw err;
    console.log("1 configuration record inserted");
  });

  con.end();
}

exports.insertTicket = insertTicket;
exports.insertConfiguration = insertConfiguration;
exports.insertDevice = insertDevice;
