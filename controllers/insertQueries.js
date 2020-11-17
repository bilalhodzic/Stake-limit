var mysql = require("mysql");
const util = require("util");

var connection;

function connectDB() {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "stake-limit",
  });

  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
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
  connection.query(sql, (err, results, fields) => {
    if (err) return console.error(err.message);
    console.log("1 ticketMessage  record inserted");
  });

  connection.end();
}

//insert a new device into database
async function insertDevice(device) {
  let sql = `insert into device (deviceId, statusId,  serviceId, totalStake,startTime) values('${device.deviceId}', 1, 11, ${device.totalStake}, '${device.startTime}')`;

  var rows = await connectDB().query(sql);
  console.log("inserted 1 device with id: ", rows.insertId);
  return rows;
}

async function insertConfiguration(configuration) {
  let sql = `insert into configuration (timeDuration, stakeLimit, hotPercentage, restrictionExpires) values(${configuration.timeDuration}, ${configuration.stakeLimit}, ${configuration.hotPercentage}, ${configuration.restrictionExpires})`;

  var rows = await connectDB().query(sql);
  console.log("inserted 1 configuration with id: ", rows.insertId);
  return rows;
}

exports.insertTicket = insertTicket;
exports.insertConfiguration = insertConfiguration;
exports.insertDevice = insertDevice;
