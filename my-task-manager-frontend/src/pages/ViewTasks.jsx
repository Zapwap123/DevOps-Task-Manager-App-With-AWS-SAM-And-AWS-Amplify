import { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";
import TaskList from "../components/TaskList";

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchWithAuth("/tasks").then(setTasks).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Tasks</h1>
      <TaskList tasks={tasks} />
    </div>
  );
}
