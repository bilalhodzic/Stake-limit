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

async function updateDeviceStake(deviceId, totalStake) {
  let sql = `Update device set totalStake=${totalStake} where deviceId='${deviceId}'`;
  connectDB();

  con.query(sql, (err, rows) => {
    if (err) return console.log(err);
    console.log("Device total stake updated");
  });
  con.end();
}
async function updateDeviceStartTime(deviceId, startTime) {
  let sql = `update device set startTime='${startTime}' where deviceId='${deviceId}'`;

  connectDB();
  con.query(sql, (err, rows) => {
    if (err) return console.log(err);
    console.log("Device start time updated");
  });
  con.end();
}
async function updateDeviceStatus(deviceId, status) {
  let sql = `update device set statusId=(select statusId from status where statusName='${status}') where deviceId='${deviceId}'`;

  connectDB();
  con.query(sql, (err, rows) => {
    if (err) return console.log(err);
    console.log("Device status updated to: ", status);
  });
  con.end();
}
async function updateDeviceRestrTime(deviceId, date) {
  let sql = `update device set startRestrTime='${date}' where deviceId='${deviceId}'`;

  connectDB();
  con.query(sql, (err, rows) => {
    if (err) return console.log(err);
    console.log("Device restriction time updated");
  });
  con.end();
}
//update device configuration--pass configuration ID and device ID
async function updateDeviceConf(deviceId, confId) {
  let sql = `update device set serviceID=${confId} where deviceId='${deviceId}'`;

  connectDB();
  con.query(sql, (err, rows) => {
    if (err) return console.log(err);
    console.log("Device Configuration updated");
  });
  con.end();
}

module.exports = {
  updateDeviceStake: updateDeviceStake,
  updateDeviceStartTime: updateDeviceStartTime,
  updateDeviceStatus: updateDeviceStatus,
  updateDeviceRestrTime: updateDeviceRestrTime,
  updateDeviceConf: updateDeviceConf,
};
