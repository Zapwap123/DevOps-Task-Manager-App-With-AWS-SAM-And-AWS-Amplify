import { fetchAuthSession } from "@aws-amplify/auth";

const apiUrl = "https://sk749ylzhl.execute-api.eu-west-1.amazonaws.com/Prod";

export async function fetchWithAuth(path, options = {}) {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString(); // ✅ Correct way in v6+

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
