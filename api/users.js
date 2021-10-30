const express = require("express");
const {
  getUserByUsername,
  createUser,
  getPublicRoutinesByUser,
} = require("../db");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const { requireUser } = require("../utilities");

//

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

//

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const maybeUser = await getUserByUsername(username);
    if (maybeUser) {
      res.status(401);
      next({
        name: "userExistsError",
        message: "A user already exists by that username.",
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: "passwordTooShort",
        message: "Password must be at least 8 characters.",
      });
    } else {
      const user = await createUser({ username, password });

      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "Thank you for signing up!",
        token,
        user,
      });
    }
  } catch ({ name, message }) {
    throw { name, message };
  }
});

//

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordsMatch) {
      const token = jwt.sign(
        {
          id: user.id,
          username: username,
        },
        JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    
    next(error);
  }
});

//

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    throw error;
  }
});

//

usersRouter.get("/:username/routines", async (req, res, next) => {
  const { username } = req.params;
 

  try {
    const userRoutines = await getPublicRoutinesByUser({ username });

    res.send(userRoutines);
  } catch (error) {
    throw error;
  }
});

module.exports = usersRouter;
