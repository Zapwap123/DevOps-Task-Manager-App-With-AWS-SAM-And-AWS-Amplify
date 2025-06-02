import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";
import TaskList from "../components/TaskList";
import { Link } from "react-router-dom";

// Function to fetch tasks from the backend and display them in a list format.
export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the backend when the component mounts and set them in the state.
  useEffect(() => {
    fetchWithAuth("/tasks").then(setTasks).catch(console.error);
  }, []);

  // Render the component with a list of tasks.
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

      <h1 className="text-xl font-bold mb-4">All Tasks</h1>
      <TaskList tasks={tasks} />
    </div>
  );
}
