const express = require("express");
const { body } = require("express-validator");
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/suggest",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required.")
      .isLength({ min: 3 })
      .withMessage("Task title must be at least 3 characters."),
    validateRequest,
  ],
  aiController.suggest
);

module.exports = router;
