import { Link } from "react-router-dom";

export default function MemberDashboard() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Member Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/tasks" className="bg-blue-100 p-4 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-blue-700">My Tasks</h2>
          <p className="text-sm text-gray-600">View tasks assigned to you</p>
        </Link>
        <Link to="/update" className="bg-green-100 p-4 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-green-700">Update Task Status</h2>
          <p className="text-sm text-gray-600">Mark tasks as in progress or completed</p>
        </Link>
        <Link to="/deadlines" className="bg-red-100 p-4 rounded-lg shadow hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-red-700">Deadline Checker</h2>
          <p className="text-sm text-gray-600">View overdue tasks</p>
        </Link>
      </div>
    </div>
  );
}
