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

module.exports = {
  updateDeviceStake: updateDeviceStake,
};
