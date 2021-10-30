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
  getRoutineActivitiesByRoutine,
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

  try {
    const routine = await getRoutineById(id);

    if (!routine) {
      next({
        name: "noRoutine",
        message: "There is no routine!",
      });
    } else if (req.user.id === routine.creatorId) {
      const deletedRoutine = await destroyRoutine(id);
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

      const doesRoutineActivityExist = await getRoutineActivitiesByRoutine({
        id: req.params.routineId,
      });

      const filteredRoutineActivities =
        doesRoutineActivityExist &&
        doesRoutineActivityExist.filter(function (elem) {
          if (elem.activityId === activityId) {
            return true;
          } else {
            return false;
          }
        });
      console.log(filteredRoutineActivities, "FILTER!!");
      if (filteredRoutineActivities && filteredRoutineActivities.length) {
        next({
          name: "routineExistsError",
          message: "this routine already esists",
        });
      } else {
        const addSingleActivity = await addActivityToRoutine(
          ActivityForRoutine
        );
        console.log(addSingleActivity, "SINGLE !!!!!!");
        if (addSingleActivity) {
          res.send(addSingleActivity);
        } else {
          next({
            name: "activity",
            message: "activity creation failed",
          });
        }
      }
    } catch (error) {
     
      next(error);
    }
  }
);

//

module.exports = routinesRouter;
