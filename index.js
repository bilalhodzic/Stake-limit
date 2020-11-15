const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const models = require("./models");

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use("/", routes);

app.listen(port, (err) => {
  if (err) console.log(err.message);
  console.log("App running on http://localhost:" + port);
});
