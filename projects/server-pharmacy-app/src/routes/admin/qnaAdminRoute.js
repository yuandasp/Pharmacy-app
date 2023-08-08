const express = require("express");
const router = express.Router();
const { qnaAdminController } = require("../../controllers");
const { verifyToken } = require("../../middleware/authVerification");
const { isAdmin } = require("../../middleware/isAdmin");

router.get(
  "/questions",
  verifyToken,
  isAdmin,
  qnaAdminController.fetchAllUserQuestion
);
router.get(
  "/:idquestion",
  verifyToken,
  isAdmin,
  qnaAdminController.fetchDetailUserQuestion
);
router.post(
  "/answer/:idquestion",
  verifyToken,
  isAdmin,
  qnaAdminController.addAnswerToUserQuestion
);
router.delete(
  "/:idquestion",
  verifyToken,
  isAdmin,
  qnaAdminController.deleteUserQuestion
);

module.exports = router;
