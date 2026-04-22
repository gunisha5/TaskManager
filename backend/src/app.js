const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const tagRoutes = require("./routes/tagRoutes");
const aiRoutes = require("./routes/aiRoutes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/ai", aiRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Manager API is running",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
