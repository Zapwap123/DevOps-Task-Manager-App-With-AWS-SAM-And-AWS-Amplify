import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";
import { Link } from "react-router-dom";

export default function UpdateTaskStatus() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchWithAuth("/tasks").then(setTasks).catch(console.error);
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await fetchWithAuth(`/tasks/${taskId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      alert("Status updated");
      setTasks((prev) =>
        prev.map((t) =>
          t.taskId === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline inline-flex items-center"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">Update Task Status</h1>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.taskId}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-semibold">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded-full font-medium ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div className="mt-2 space-x-2">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  onClick={() => updateStatus(task.taskId, "In Progress")}
                >
                  In Progress
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => updateStatus(task.taskId, "Completed")}
                >
                  Complete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
