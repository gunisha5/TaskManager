// TODO: Implement TaskCard component
// Displays a single task with title, priority badge, status, tags, and actions
const TaskCard = ({ task, onEdit, onDelete, onMarkDone }) => {
  return (
    <div className="task-card" data-priority={task?.priority}>
      <h3>{task?.title}</h3>
      <p>{task?.description}</p>
      {/* Actions, tags, priority badge — to be implemented */}
    </div>
  );
};

export default TaskCard;
