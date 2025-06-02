import { useState } from "react";
import { fetchWithAuth } from "../api";
import { Link } from "react-router-dom";

export default function CreateTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth("/tasks", {
        method: "POST",
        body: JSON.stringify(form),
      });
      alert("Task created!");
      setForm({ title: "", description: "", assignedTo: "", deadline: "" });
    } catch (err) {
      alert("Error creating task");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          to="/admin"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-xl font-bold mb-4">Create Task</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="assignedTo"
          placeholder="Assign to (username)"
          className="w-full p-2 border rounded"
          value={form.assignedTo}
          onChange={handleChange}
          required
        />
        <input
          name="deadline"
          type="date"
          className="w-full p-2 border rounded"
          value={form.deadline}
          onChange={handleChange}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
