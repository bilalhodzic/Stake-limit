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
async function insertTicket(ticket, date) {
  let sql = `insert into ticketmessage (id, deviceId, stake,  sendTime) values('${ticket.id}', '${ticket.deviceId}', ${ticket.stake}, '${date}')`;

  var rows = await connectDB().query(sql);
  console.log("inserted 1 ticketMessage with id: ", ticket.id);
  return rows;
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
