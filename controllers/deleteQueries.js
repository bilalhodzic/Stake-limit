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

async function deleteTicket(ticketMessageID) {
  let sql = `delete from ticketmessage where id='${ticketMessageID}'`;

  var rows = await connectDB().query(sql);
  console.log("deleted 1 ticketMessage with id: ", ticketMessageID);
  return rows;
}
async function deleteAllTickets() {
  let sql = `delete from ticketmessage`;
  var rows = await connectDB().query(sql);
  console.log("deleted 1 ticketMessage with id: ");
  return rows;
}

module.exports = {
  deleteTicket: deleteTicket,
  deleteAllTickets: deleteAllTickets,
};
