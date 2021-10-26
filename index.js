// create the express server here
const { PORT = 3000 } = process.env;

const express = require("express");
require("dotenv").config();

const server = express();

//

const bodyParser = require("body-parser");
server.use(bodyParser.json());

const morgan = require("morgan");
server.use(morgan("dev"));

//

const apiRouter = require("./api");
server.use("/api", apiRouter);

//

const client = require("./db/client");
client.connect();

server.listen(PORT, () => {
  console.log("Server is up!", PORT);
});
