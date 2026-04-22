const taskService = require("../services/taskService");
const { createHttpError } = require("../middleware/errorMiddleware");

const listTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.listTasks(req.user.userId, req.query);
    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.userId, req.params.id);
    if (!task) {
      return next(createHttpError(404, "Task not found."));
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.user.userId,
      req.params.id,
      req.body
    );

    if (!task) {
      return next(createHttpError(404, "Task not found."));
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.user.userId, req.params.id);
    if (!task) {
      return next(createHttpError(404, "Task not found."));
    }

    return res.status(200).json({
      success: true,
      data: { id: task._id },
    });
  } catch (error) {
    return next(error);
  }
};

const markTaskAsDone = async (req, res, next) => {
  try {
    const task = await taskService.markTaskAsDone(
      req.user.userId,
      req.params.id
    );
    if (!task) {
      return next(createHttpError(404, "Task not found."));
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  markTaskAsDone,
};
