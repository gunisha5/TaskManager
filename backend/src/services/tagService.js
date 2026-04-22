const Tag = require("../models/Tag");
const Task = require("../models/Task");

const listTags = async (userId) => {
  return Tag.find({ userId }).sort({ createdAt: -1 });
};

const createTag = async (userId, payload) => {
  return Tag.create({
    ...payload,
    userId,
  });
};

const updateTag = async (userId, tagId, name) => {
  return Tag.findOneAndUpdate(
    { _id: tagId, userId },
    { name: name.trim() },
    { new: true, runValidators: true }
  );
};

const deleteTag = async (userId, tagId) => {
  const tag = await Tag.findOneAndDelete({ _id: tagId, userId });
  if (!tag) {
    return null;
  }

  await Task.updateMany({ userId }, { $pull: { tags: tag.name } });
  return tag;
};

module.exports = {
  listTags,
  createTag,
  updateTag,
  deleteTag,
};
