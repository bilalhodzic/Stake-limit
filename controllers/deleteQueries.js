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
  connection.connect((err) => {
    if (err) console.log(err.message);
  });
}

async function deleteTicket(ticketMessageID) {
  let sql = `delete from ticketmessage where id='${ticketMessageID}'`;

  connectDB();
  connection.query(sql, (err) => {
    if (err) return console.log(err);
    console.log("Deleted 1 ticket message ");
  });
  connection.end();
}

module.exports = {
  deleteTicket: deleteTicket,
};
