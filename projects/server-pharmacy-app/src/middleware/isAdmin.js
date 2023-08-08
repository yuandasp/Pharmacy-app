const isAdmin = (req, res, next) => {
  const verifiedUser = req.user;

  if (verifiedUser.type === "admin") {
    next();
  } else {
    return res.status(400).send({ message: "Access denied!" });
  }
};

module.exports = {
  isAdmin,
};
