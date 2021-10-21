const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE id=$1;
    `,
      [id]
    );

    return routine_activities;
  } catch (err) {
    throw err;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    console.log("Hello!");
    const {
      rows: [routineActivity],
    } = await client.query(
      `
	    INSERT INTO routine_activities("routineId", "activityId", count, duration)
	    VALUES($1, $2, $3, $4)
	    ON CONFLICT ("routineId", "activityId") DO NOTHING
	    RETURNING *;
	    `,
      [routineId, activityId, count, duration]
    );
    console.log(routineActivity, "HELLO!");
    return routineActivity;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  //   updateRoutineActivity,
  //   destroyRoutineActivity,
  //   getRoutineActivitiesByRoutine,
};
