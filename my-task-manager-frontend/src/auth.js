import { fetchAuthSession } from "@aws-amplify/auth";

// This file contains the API utility functions for making authenticated requests
// to the backend. It uses the Amplify Auth module to fetch the current user's session
export async function getCurrentUserGroups() {
  try {
    // Fetch the current auth session
    const session = await fetchAuthSession();

    // The tokens object contains idToken, accessToken, refreshToken
    const idToken = session.tokens?.idToken;

    if (!idToken) {
      throw new Error("ID token not available in session.");
    }

    // idToken.payload contains the JWT claims
    const groups = idToken.payload["cognito:groups"] || [];

    // Return the first group or null if no groups found
    return groups.length > 0 ? groups[0] : null;
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return null;
  }
}
