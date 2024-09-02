const API_BASE_URL = "http://localhost:3000";

export const fetchHomes = async () => {
  const response = await fetch(`${API_BASE_URL}/home`);
  if (!response.ok) throw new Error("Failed to fetch home data");
  return response.json();
};

export const fetchHomesByUserId = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/home?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch home data for user");
  return response.json();
};

export const fetchUsersByHomeId = async (homeId: string) => {
  const response = await fetch(`${API_BASE_URL}/users?homeId=${homeId}`);
  if (!response.ok) throw new Error("Failed to fetch user data for home");
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const updateHomeUsers = async (homeId: string, userIds: number[]) => {
  const response = await fetch(`${API_BASE_URL}/home/${homeId}/users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userIds }),
  });
  if (!response.ok) throw new Error("Failed to update home users");
  return response.json();
};
