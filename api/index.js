// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;


apiRouter.get("/health", async (req, res, next) => {
  res.send({
    message: "The server is healthy",
  });
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
