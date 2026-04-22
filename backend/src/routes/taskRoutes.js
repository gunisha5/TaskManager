const express = require("express");
const { body, param, query } = require("express-validator");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(authMiddleware);

const taskWriteValidators = [
  body("title").optional().trim().notEmpty().withMessage("Task title is required."),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high."),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be todo, in-progress, or done."),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings."),
  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string."),
  body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid date."),
];

const taskIdValidator = [
  param("id").isMongoId().withMessage("Task id must be a valid Mongo id."),
  validateRequest,
];

router.get(
  "/",
  [
    query("status")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Status must be todo, in-progress, or done."),
    query("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high."),
    validateRequest,
  ],
  taskController.listTasks
);

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Task title is required."),
    ...taskWriteValidators,
    validateRequest,
  ],
  taskController.createTask
);

router.get("/:id", taskIdValidator, taskController.getTask);
router.patch("/:id", [...taskIdValidator, ...taskWriteValidators], taskController.updateTask);
router.delete("/:id", taskIdValidator, taskController.deleteTask);
router.patch("/:id/done", taskIdValidator, taskController.markTaskAsDone);

module.exports = router;
