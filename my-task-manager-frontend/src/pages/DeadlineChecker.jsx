import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";
import { Link } from "react-router-dom";

// Function to check if a task is overdue
function isOverdue(deadline) {
  const today = new Date().toISOString().split("T")[0];
  return deadline < today;
}

// This component displays overdue tasks for admins.
export default function DeadlineChecker() {
  const [tasks, setTasks] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  // Fetch overdue tasks from the backend when the component mounts
  // and whenever the 'today' variable changes.
  useEffect(() => {
    fetchWithAuth("/tasks").then((data) => {
      const overdue = data.filter(
        (task) => task.deadline < today && task.status !== "Completed"
      );
      setTasks(overdue);
    });
  }, [today]);

  // Render the component with a list of overdue tasks
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/admin"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-xl font-bold mb-4">Overdue Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-green-700 font-medium">No overdue tasks 🎉</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.taskId}
              className="border p-4 rounded bg-red-50 shadow-sm"
            >
              <p className="font-semibold text-red-800">{task.title}</p>
              <p className="text-sm text-gray-700">Due: {task.deadline}</p>
              <p className="text-sm text-gray-700">Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
