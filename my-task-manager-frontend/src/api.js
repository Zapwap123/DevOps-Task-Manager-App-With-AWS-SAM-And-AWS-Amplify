import { fetchAuthSession } from "@aws-amplify/auth";

const apiUrl = "https://sk749ylzhl.execute-api.eu-west-1.amazonaws.com/Prod";

export async function fetchWithAuth(url, options = {}) {
  try {
    const session = await fetchAuthSession();
    const token = session.getIdToken().getJwtToken();

    const response = await fetch(`${apiUrl}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Auth or fetch error:", error);
    throw error;
  }
}
