// This component displays a list of tasks with their details.
export default function TaskList({ tasks }) {
  return (
    <div>
      <h2 className='text-xl font-semibold'>Tasks</h2>
      <ul className='mt-2'>
        {/* Display the list of tasks. */}
        {tasks.map((task) => (
          <li key={task.taskId} className='p-2 border mb-2 rounded shadow-sm'>
            <p>
              <strong>Title:</strong> {task.title}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Assigned To:</strong> {task.assignedTo}
            </p>
            <p>
              <strong>Deadline:</strong> {task.deadline}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
