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

//just to check if there are all statues in db
async function getAllStatus() {
  let sql = `select * from status`;

  const rows = await connectDB().query(sql);
  return rows[0];
}

//get status for one deviceid
async function getStatus(deviceId) {
  let sql = `SELECT s.statusName FROM device  as d inner join status as s on d.statusID=s.statusId where d.deviceId='${deviceId}'`;

  const rows = await connectDB().query(sql);
  return rows[0];
}

//get one device from device table
async function getDevice(deviceId) {
  let sql = `select deviceId from device where deviceId='${deviceId}'`;

  const rows = await connectDB().query(sql);
  return rows[0];
}
async function getTicketMessage(deviceId) {
  let sql = `select * from ticketmessage where deviceId='${deviceId}'`;
  const rows = await connectDB().query(sql);
  return rows;
}
async function getTicketMessageTime(deviceId) {
  let sql = `select * from ticketmessage  where deviceId='${deviceId}' order by sendTime desc`;
  const rows = await connectDB().query(sql);
  return rows;
}

async function getDeviceDetails(deviceid) {
  let sql = `select * from device as d inner join status as s on d.statusId=s.statusId inner join configuration as c on d.serviceId=c.serviceID where d.deviceId='${deviceid}'`;

  const rows = await connectDB().query(sql);

  return rows[0];
}
async function getAllDevices() {
  let sql = `select * from device`;
  const rows = await connectDB().query(sql);
  return rows;
}

exports.getAllStatus = getAllStatus;
exports.getStatus = getStatus;
exports.getDevice = getDevice;
exports.getDeviceDetails = getDeviceDetails;
exports.getTicketMessage = getTicketMessage;
exports.getTicketMessageTime = getTicketMessageTime;
exports.getAllDevices = getAllDevices;
