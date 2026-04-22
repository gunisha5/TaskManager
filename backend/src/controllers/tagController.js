const tagService = require("../services/tagService");
const { createHttpError } = require("../middleware/errorMiddleware");

const listTags = async (req, res, next) => {
  try {
    const tags = await tagService.listTags(req.user.userId);
    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    return next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const tag = await tagService.createTag(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    return next(error);
  }
};

const updateTag = async (req, res, next) => {
  try {
    const tag = await tagService.updateTag(
      req.user.userId,
      req.params.id,
      req.body.name
    );

    if (!tag) {
      return next(createHttpError(404, "Tag not found."));
    }

    return res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const tag = await tagService.deleteTag(req.user.userId, req.params.id);

    if (!tag) {
      return next(createHttpError(404, "Tag not found."));
    }

    return res.status(200).json({
      success: true,
      data: { id: tag._id },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTags,
  createTag,
  updateTag,
  deleteTag,
};
