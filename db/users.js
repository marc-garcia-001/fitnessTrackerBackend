const client = require("./client");

const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users(username, password)
            VALUES($1, $2)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
            `,
      [username, hashedPassword]
    );
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

//

async function getUser({ username, password }) {
  if (!username || !password) {
    return;
  }

  const user = await getUserByUsername(username);

  if (!user) {
    return;
  }

  console.log(user);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    console.log(hashedPassword);
    delete user.password;
    return user;
  } else {
    return;
  }
}

//

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
            SELECT *
            FROM users
            WHERE id=$1;
            `,
      [id]
    );

    if (user) {
      delete user.password;
      return user;
    } else {
      throw Error("User by that id doesn't exist!");
    }
  } catch (error) {
    throw error;
  }
}

//

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username=$1;
    `,
      [username]
    );

    if (user) {
      return user;
    } else {
      throw Error("User by this username doesn't exist!");
    }
  } catch (error) {}
}

//

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
