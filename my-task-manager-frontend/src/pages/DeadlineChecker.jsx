import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";

export default function DeadlineChecker() {
  const [tasks, setTasks] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchWithAuth("/tasks").then((data) => {
      const overdue = data.filter((task) => task.deadline < today && task.status !== "Completed");
      setTasks(overdue);
    });
  }, [today]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Overdue Tasks</h1>
      {tasks.length === 0 ? (
        <p>No overdue tasks 🎉</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.taskId} className="border p-3 mb-2 rounded bg-red-100 shadow-sm">
              <p><strong>{task.title}</strong> — Due: {task.deadline}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
