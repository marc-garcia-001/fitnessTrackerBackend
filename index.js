// create the express server here
const { PORT = 3000 } = process.env;

const express = require("express");
require("dotenv").config();

const server = express();


const cors = require("cors");
server.use(cors());


//

const bodyParser = require("body-parser");
server.use(bodyParser.json());

const morgan = require("morgan");
server.use(morgan("dev"));

//

const apiRouter = require("./api");
server.use("/api", apiRouter);

//404 handler
server.get('*', (req, res) => {
  res.status(404)
  // .send({error: '404 - Not Found', message: 'No route found for the requested URL'});
});

// error handling middleware
server.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  // res.send({error: error.message, name: error.name, message: error.message, table: error.table});
});

const client = require("./db/client");
client.connect();

server.listen(PORT, () => {
  console.log("Server is up!", PORT);
});
