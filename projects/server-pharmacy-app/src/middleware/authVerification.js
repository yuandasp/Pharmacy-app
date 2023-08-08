const jwt = require("jsonwebtoken");
const { query } = require("../database");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(400).send({ message: "Access denied!" });
  }

  token = token.split(" ")[1];
  if (token == null || !token) {
    return res.status(400).send({ message: "Access denied!" });
  }

  let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
  if (!verifiedUser) {
    return res.status(400).send({ message: "Access Denied" });
  }

  req.user = verifiedUser;
  next();
};

module.exports = {
  verifyToken,
};
