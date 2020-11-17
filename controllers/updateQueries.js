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

async function updateDeviceStake(deviceId, totalStake) {
  let sql = `Update device set totalStake=${totalStake} where deviceId='${deviceId}'`;

  var rows = await connectDB().query(sql);
  console.log("Device total stake updated to: ", totalStake);
  return rows;
}
async function updateDeviceStartTime(deviceId, startTime) {
  let sql = `update device set startTime='${startTime}' where deviceId='${deviceId}'`;

  var rows = await connectDB().query(sql);
  console.log("Device start time updated to: ", startTime);
  return rows;
}
async function updateDeviceStatus(deviceId, status) {
  let sql = `update device set statusId=(select statusId from status where statusName='${status}') where deviceId='${deviceId}'`;

  var rows = await connectDB().query(sql);
  console.log("Device status updated to: ", status);
  return rows;
}
async function updateDeviceRestrTime(deviceId, date) {
  let sql = `update device set startRestrTime='${date}' where deviceId='${deviceId}'`;

  var rows = await connectDB().query(sql);
  console.log("Device restriction time updated to: ", date);
  return rows;
}
//update device configuration--pass configuration ID and device ID
async function updateDeviceConf(deviceId, confId) {
  let sql = `update device set serviceID=${confId} where deviceId='${deviceId}'`;

  var rows = await connectDB().query(sql);
  console.log("Device configuration updated");
  return rows;
}

module.exports = {
  updateDeviceStake: updateDeviceStake,
  updateDeviceStartTime: updateDeviceStartTime,
  updateDeviceStatus: updateDeviceStatus,
  updateDeviceRestrTime: updateDeviceRestrTime,
  updateDeviceConf: updateDeviceConf,
};
