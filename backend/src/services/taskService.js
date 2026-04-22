const Task = require("../models/Task");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildTaskFilters = (userId, query = {}) => {
  const filters = { userId };

  if (query.status) {
    filters.status = query.status;
  }

  if (query.priority) {
    filters.priority = query.priority;
  }

  if (query.tags) {
    const tags = Array.isArray(query.tags)
      ? query.tags
      : String(query.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

    if (tags.length > 0) {
      filters.tags = { $in: tags };
    }
  }

  if (query.search) {
    const searchTerm = String(query.search).trim();
    if (searchTerm) {
      filters.title = { $regex: escapeRegex(searchTerm), $options: "i" };
    }
  }

  return filters;
};

const listTasks = async (userId, query) => {
  const filters = buildTaskFilters(userId, query);
  return Task.find(filters).sort({ createdAt: -1 });
};

const createTask = async (userId, payload) => {
  return Task.create({
    ...payload,
    userId,
  });
};

const getTaskById = async (userId, taskId) => {
  return Task.findOne({ _id: taskId, userId });
};

const updateTask = async (userId, taskId, payload) => {
  return Task.findOneAndUpdate({ _id: taskId, userId }, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteTask = async (userId, taskId) => {
  return Task.findOneAndDelete({ _id: taskId, userId });
};

const markTaskAsDone = async (userId, taskId) => {
  return Task.findOneAndUpdate(
    { _id: taskId, userId },
    { status: "done" },
    { new: true, runValidators: true }
  );
};

module.exports = {
  listTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  markTaskAsDone,
};
