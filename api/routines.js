const express = require("express");
const routinesRouter = express.Router();
const {
  getRoutineById,
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  destroyRoutineActivity,
} = require("../db");
const { requireUser } = require("../utilities");

//

routinesRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

//

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, goal, isPublic } = req.body;

  try {
    const routine = await createRoutine({
      creatorId: req.user.id,
      isPublic,
      name,
      goal,
    });
    if (routine) {
      res.send(routine);
    } else {
      next({
        name: "failedToCreate",
        message: "Could not create routine!",
      });
    }
  } catch (error) {
    next(error);
  }
});

//

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  try {
    const { ...fields } = req.body;
    const id = req.params.routineId;

    const routineToUpdate = await getRoutineById(id);

    if (!routineToUpdate) {
      next({ name: "wrong routine" });
    } else {
      if (req.user.id !== routineToUpdate.creatorId) {
        next({ name: "must be user" });
      } else {
        const newRoutine = await updateRoutine({ id, ...fields });

        if (newRoutine) {
          res.send(newRoutine);
        } else {
          next({ name: "routine doesn't exist" });
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

//

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const id = req.params.routineId;
  console.log("ID!!", id);

  try {
    const routine = await getRoutineById(id);
    console.log("2ndHERE!!", routine);

    if (!routine) {
      next({
        name: "noRoutine",
        message: "There is no routine!",
      });
    } else if (req.user.id === routine.creatorId) {
      const deletedRoutine = await destroyRoutine(id);
      console.log("HERE!!", deletedRoutine);
      res.send({ ...deletedRoutine, success: true });
    } else {
      next({
        name: "notTheCreator",
        message: "You're not the creator of this routine!",
      });
    }
  } catch (error) {
    next(error);
  }
});

//

routinesRouter.post(
  "/:routineId/activities",
  requireUser,
  async (req, res, next) => {
    const { activityId, count, duration } = req.body;
    const ActivityForRoutine = {};
    try {
      ActivityForRoutine.routineId = req.params.routineId;
      ActivityForRoutine.activityId = activityId;
      ActivityForRoutine.count = count;
      ActivityForRoutine.duration = duration;

      const addSingleActivity = await addActivityToRoutine(ActivityForRoutine);

      res.send(addSingleActivity);
    } catch (error) {
      next(error);
    }
  }
);

//

module.exports = routinesRouter;
