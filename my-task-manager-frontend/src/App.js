import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { getCurrentUserGroups } from "./auth";
import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

// Importing pages for different routes
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import CreateTask from "./pages/CreateTask";
import ViewTasks from "./pages/ViewTasks";
import UpdateTaskStatus from "./pages/UpdateTaskStatus";
import DeadlineChecker from "./pages/DeadlineChecker";
import NotAuthorized from "./pages/NotAuthorized";

// Configure Amplify with the AWS exports
// This file contains the main App component that sets up routing and authentication
// and imports the necessary components for the application.
Amplify.configure(awsExports);

// Amplify UI styles
export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => <RouterWrapper user={user} signOut={signOut} />}
    </Authenticator>
  );
}

// RouterWrapper component that handles routing based on user group
function RouterWrapper({ user, signOut }) {
  const [group, setGroup] = useState(null);

  // Fetch the current user's group when the component mounts and set it in the state.
  useEffect(() => {
    getCurrentUserGroups().then(setGroup);
  }, []);

  if (!group) return <p className='p-4'>Loading...</p>;

  // Render the application with different routes based on user group
  return (
    <Router>
      <div className='p-4'>
        <button
          onClick={signOut}
          className='bg-red-600 text-white px-4 py-2 rounded mb-4'
        >
          Sign Out
        </button>
        <Routes>
          {/* If the user is an Admin, redirect them to these pages */}
          {group === "Admin" && (
            <>
              <Route path='/' element={<AdminDashboard />} />
              <Route path='/create' element={<CreateTask />} />
              <Route path='/tasks' element={<ViewTasks />} />
              <Route path='/deadlines' element={<DeadlineChecker />} />
              <Route path='*' element={<Navigate to='/' />} />
            </>
          )}
          {/* If the user is an Member, redirect them to these pages */}
          {group === "Member" && (
            <>
              <Route path='/' element={<MemberDashboard />} />
              <Route path='/tasks' element={<ViewTasks />} />
              <Route path='/update' element={<UpdateTaskStatus />} />
              <Route path='/deadlines' element={<DeadlineChecker />} />
              <Route path='*' element={<Navigate to='/' />} />
            </>
          )}
          {/* If the user is not authorized, redirect them to this page */}
          <Route path='/not-authorized' element={<NotAuthorized />} />
        </Routes>
      </div>
    </Router>
  );
}
