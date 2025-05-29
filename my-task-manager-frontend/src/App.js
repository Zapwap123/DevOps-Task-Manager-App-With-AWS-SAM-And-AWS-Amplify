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

import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import CreateTask from "./pages/CreateTask";
import ViewTasks from "./pages/ViewTasks";
import UpdateTaskStatus from "./pages/UpdateTaskStatus";
import DeadlineChecker from "./pages/DeadlineChecker";
import NotAuthorized from "./pages/NotAuthorized";

Amplify.configure(awsExports);

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => <RouterWrapper user={user} signOut={signOut} />}
    </Authenticator>
  );
}

function RouterWrapper({ user, signOut }) {
  const [group, setGroup] = useState(null);

  useEffect(() => {
    getCurrentUserGroups().then(setGroup);
  }, []);

  if (!group) return <p className='p-4'>Loading...</p>;

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
          {group === "Admin" && (
            <>
              <Route path='/' element={<AdminDashboard />} />
              <Route path='/create' element={<CreateTask />} />
              <Route path='/tasks' element={<ViewTasks />} />
              <Route path='/deadlines' element={<DeadlineChecker />} />
              <Route path='*' element={<Navigate to='/' />} />
            </>
          )}
          {group === "Member" && (
            <>
              <Route path='/' element={<MemberDashboard />} />
              <Route path='/tasks' element={<ViewTasks />} />
              <Route path='/update' element={<UpdateTaskStatus />} />
              <Route path='/deadlines' element={<DeadlineChecker />} />
              <Route path='*' element={<Navigate to='/' />} />
            </>
          )}
          <Route path='/not-authorized' element={<NotAuthorized />} />
        </Routes>
      </div>
    </Router>
  );
}
