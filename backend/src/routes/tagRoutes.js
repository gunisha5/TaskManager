const express = require("express");
const { body, param } = require("express-validator");
const tagController = require("../controllers/tagController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", tagController.listTags);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Tag name is required."),
    validateRequest,
  ],
  tagController.createTag
);

router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Tag id must be a valid Mongo id."),
    body("name").trim().notEmpty().withMessage("Tag name is required."),
    validateRequest,
  ],
  tagController.updateTag
);

router.delete(
  "/:id",
  [
    param("id").isMongoId().withMessage("Tag id must be a valid Mongo id."),
    validateRequest,
  ],
  tagController.deleteTag
);

module.exports = router;
