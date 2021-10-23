const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            SELECT *
            FROM routines
            WHERE id=$1
            `,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

//

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(
      `
    SELECT *
    FROM routines
     `
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

//

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
    SELECT *, user.username AS "creatorName"
    FROM routines
    JOIN users ON routines WHERE "creatorId" = user.id
    `
    );
    return routines;
  } catch (error) {
    throw error;
  }
}

//

async function getAllPublicRoutines() {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM routines
        WHERE "isPublic"=true
        `
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

//

async function getAllRoutinesByUser({ username }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            SELECT *
            FROM routines
            WHERE username=$1
            `,
      [username]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

//

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
            SELECT *
            FROM routines
            WHERE username=$1 && "isPublic"=true
            `
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

//

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
            SELECT *
            FROM routine_activites
            WHERE "activityId"=$1
            `,
      [id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

//

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            INSERT INTO routines("creatorId", "isPublic", name, goal)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
      [creatorId, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

//

async function updateRoutine({ id, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
                UPDATE routines("isPublic", name, goal)
                VALUES ($1, $2, $3)

                WHERE id=${id}
                RETURNING *;
                `,
      [id, isPublic, name, goal]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

//

async function destroyRoutine(id) {}

//

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllRoutinesByUser,
  getAllPublicRoutines,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
