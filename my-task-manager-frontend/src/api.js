import { fetchAuthSession } from "@aws-amplify/auth";

// This file contains the API utility functions for making authenticated requests
// to the backend. It uses the Amplify Auth module to fetch the current user's session
// and includes the ID token in the request headers for authorization.
const apiUrl = "https://sk749ylzhl.execute-api.eu-west-1.amazonaws.com/Prod";

// This function fetches the current user's session and returns the ID token
async function fetchAuthSessionIdToken() {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString();
}

// This function makes an authenticated fetch request to the specified path
// and includes the ID token in the request headers.
export async function fetchWithAuth(path, options = {}) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  return fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
      ...(options.headers || {}),
    },
  }).then((res) => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  });
}
