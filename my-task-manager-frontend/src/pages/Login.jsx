import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { getUserGroup } from '../auth';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Task Manager Login</h2>
        <Authenticator
          loginMechanisms={['username']}
          hideSignUp={false}
          variation="modal"
        >
          {({ signOut, user }) => {
            getUserGroup(user).then(group => {
              if (group === 'Admin') navigate('/admin');
              else if (group === 'Member') navigate('/member');
              else navigate('/not-authorized');
            });

            return (
              <div className="text-center mt-4">
                <p>Redirecting to your dashboard...</p>
                <button
                  onClick={signOut}
                  className="mt-2 px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            );
          }}
        </Authenticator>
      </div>
    </div>
  );
};

export default Login;
