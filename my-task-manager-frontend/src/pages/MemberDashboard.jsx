import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../api';
import TaskList from '../components/TaskList';

export default function MemberDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchWithAuth('/tasks').then((data) => {
      setTasks(data.filter((task) => task.assignedTo));
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Member Dashboard</h1>
      <TaskList tasks={tasks} />
    </div>
  );
}
