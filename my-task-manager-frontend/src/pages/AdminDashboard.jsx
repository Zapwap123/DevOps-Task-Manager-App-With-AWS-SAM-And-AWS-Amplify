import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="space-y-2">
        <li><Link to="/create" className="text-blue-600 underline">Create Task</Link></li>
        <li><Link to="/tasks" className="text-blue-600 underline">View All Tasks</Link></li>
        <li><Link to="/deadlines" className="text-blue-600 underline">Deadline Checker</Link></li>
      </ul>
    </div>
  );
}
