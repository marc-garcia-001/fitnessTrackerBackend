const client = require("./client");

async function getActivityById(id) {
	try {
	  const {
	    rows: [activity],
	  } = await client.query(
	    `
	      SELECT *
	      FROM activities
	      WHERE id=$1;
	    `,
	    [id]
	  );
      
	  return activity;
	} catch (err) {
	  throw err;
	}
      }

async function getAllActivities() {
  try {
    const { rows } = await client.query(`
			
	SELECT * 
	FROM activities;

	`);
    return rows;
  } catch (err) {
    throw err;
  }
}

async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
	INSERT INTO activities(name, description)
	VALUES ($1, $2)
	ON CONFLICT (name) DO NOTHING
	RETURNING *;
	`,
      [name, description]
    );
    return activity;
  } catch (err) {
    throw err;
  }
}

async function updateActivity({ id, name, description }) {
	try {
	  const {
	    rows: [activity],
	  } = await client.query(
	    `
	    UPDATE activities
	    SET name=$1, description=$2
	    WHERE id=$3
	    RETURNING *;
	  `,
	    [name, description, id]
	  );
      
	  return activity;
	} catch (err) {
	  throw err;
	}
      }
      

module.exports = {
getActivityById,
getAllActivities, 
createActivity,
updateActivity
};
