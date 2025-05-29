import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";

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
        prev.map((t) => (t.taskId === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Update Task Status</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.taskId} className="border p-3 rounded mb-2 shadow-sm">
            <p><strong>{task.title}</strong> ({task.status})</p>
            <button
              className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded"
              onClick={() => updateStatus(task.taskId, "In Progress")}
            >
              In Progress
            </button>
            <button
              className="bg-green-600 text-white px-2 py-1 rounded"
              onClick={() => updateStatus(task.taskId, "Completed")}
            >
              Complete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
