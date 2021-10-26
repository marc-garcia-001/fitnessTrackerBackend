const requireUser = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    next({
      message: "You must be logged in",
    });
  }
  next();
};

module.exports = {
  requireUser,
};
