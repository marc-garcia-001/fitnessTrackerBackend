const express = require("express");
const activitiesRouter = express.Router();
const { requireUser } = require("../utilities");
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  updateActivity,
  createActivity,
  getActivityById,
} = require("../db");

//

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");

  next();
});

//

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();

    res.send(activities);
  } catch (error) {
    throw error;
  }
});

//

activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const newActivity = await createActivity({ name, description });

    res.send(newActivity);
  } catch (error) {
    throw error;
  }
});

//

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const { activityId } = req.params;

  try {
    const maybeActivity = await getActivityById(activityId);

    if (maybeActivity) {
      const updatedActivity = await updateActivity({
        id: activityId,
        name,
        description,
      });

      res.send(updatedActivity);
    } else {
      next({
        name: "activityNotFound",
        message: "The activity by that ID doesn't exist.",
      });
    }
  } catch (error) {
    throw error;
  }
});

//

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;

  try {
    const routines = await getPublicRoutinesByActivity({ id: activityId });

    res.send(routines);
  } catch (error) {
    throw error;
  }
});

//

module.exports = activitiesRouter;
