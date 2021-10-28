const { getUserByUsername } = require("./users");
const { attachActivitiesToRoutines, getActivityById } = require("./activities");
const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
            SELECT *
            FROM routines
            WHERE id=$1;
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
    SELECT routines.id, routines."creatorId", routines."isPublic", routines.name, routines.goal 
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
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId" = users.id;
        `
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

//

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId" = users.id
        WHERE "isPublic" = true;
        `
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

//

async function getAllRoutinesByUser({ username }) {
  try {
    const userInfo = await getUserByUsername(username);
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "creatorId" = $1;
            `,
      [userInfo.id]
    );

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

//

async function getPublicRoutinesByUser({ username }) {
  try {
    const userInfo = await getUserByUsername(username);
    const { rows: routines } = await client.query(
      `
           SELECT routines.*, users.username AS "creatorName"
           FROM routines
           JOIN users ON routines."creatorId" = users.id
           WHERE "creatorId" = $1 AND "isPublic" = true;  
           
            `,
      [userInfo.id]
    );
    return attachActivitiesToRoutines(routines);
    0;
  } catch (error) {
    throw error;
  }
}

//

async function getPublicRoutinesByActivity({ id }) {
  try {
    const getActivityInfo = await getActivityById(id);
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      JOIN routine_activities ON routine_activities."routineId" = routines.id
      WHERE routine_activities."activityId" = $1; 
            `,
      [getActivityInfo.id]
    );
    return attachActivitiesToRoutines(routines);
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
    if (!id) {
      return;
    }

    if (!isPublic) {
      isPublic = null;
    }

    if (!name) {
      name = null;
    }

    if (!goal) {
      goal = null;
    }

    const {
      rows: [routine],
    } = await client.query(
      `
                UPDATE routines
                SET "isPublic"=$1, name=$2, goal=$3
                WHERE id=$4
                RETURNING *;
                `,
      [isPublic, name, goal, id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

//

async function destroyRoutine(id) {
  try {
    await client.query(
      `
        DELETE 
        FROM routine_activities
        WHERE id=$1;
      `,
      [id]
    );

    const {
      rows: [routine],
    } = await client.query(
      `
        DELETE 
        FROM routines
        WHERE id=$1
        RETURNING *;
      `,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

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
