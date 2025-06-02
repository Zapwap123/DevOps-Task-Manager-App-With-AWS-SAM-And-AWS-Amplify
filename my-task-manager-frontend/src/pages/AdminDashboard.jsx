import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const links = [
    { path: "/create", label: "Create Task" },
    { path: "/tasks", label: "View All Tasks" },
    { path: "/deadlines", label: "Deadline Checker" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="block border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold p-6 rounded-xl shadow hover:shadow-lg text-center transition duration-300"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
