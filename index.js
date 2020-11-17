const express = require("express");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/postRoutes");
const getRoutes = require("./routes/getRoutes");
const updateRoutes = require("./routes/updateRoutes");
const deleteRoutes = require("./routes/deleteRoutes");

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use("/", postRoutes);
app.use("/", getRoutes);
app.use("/", updateRoutes);
app.use("/", deleteRoutes);

app.listen(port, (err) => {
  if (err) console.log(err.message);
  console.log("App running on http://localhost:" + port);
});
