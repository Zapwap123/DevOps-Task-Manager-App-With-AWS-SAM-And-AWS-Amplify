import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { getCurrentUserGroups } from "./auth.js";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard.jsx";
import awsExports from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

function DashboardRouter({ signOut }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    if (user) {
      getCurrentUserGroups().then(setGroup);
    }
  }, [user]);

  return (
    <div className='p-4'>
      <button
        onClick={signOut}
        className='bg-red-500 text-white px-4 py-2 rounded mb-4'
      >
        Sign Out
      </button>
      {group === "Admin" && <AdminDashboard user={user} />}
      {group === "Member" && <MemberDashboard user={user} />}
      {!group && <p>User not in a group. Please contact admin.</p>}
    </div>
  );
}

export default function App() {
  return (
    <Authenticator
      signUpAttributes={["email", "name"]}
      components={{
        SignUp: {
          FormFields() {
            return <Authenticator.SignUp.FormFields />;
          },
        },
      }}
    >
      {({ signOut }) => <DashboardRouter signOut={signOut} />}
    </Authenticator>
  );
}
