import { Link } from "react-router-dom";

export default function MemberDashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Member Dashboard</h1>
      <ul className="space-y-2">
        <li><Link to="/tasks" className="text-blue-600 underline">My Tasks</Link></li>
        <li><Link to="/update" className="text-blue-600 underline">Update Task Status</Link></li>
        <li><Link to="/deadlines" className="text-blue-600 underline">Deadline Checker</Link></li>
      </ul>
    </div>
  );
}
