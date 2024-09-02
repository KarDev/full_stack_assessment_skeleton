import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHomesByUserId, fetchUsers } from "./utils/api";
import HomeListing from "./components/HomeListing";

interface User {
  id: number;
  uniqueId: string;
  username: string;
  email: string;
}

interface UserResponse {
  data: User[];
  count: number;
}

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: usersResponse, isLoading: isLoadingUsers } =
    useQuery<UserResponse>({
      queryKey: ["users"],
      queryFn: fetchUsers,
    });

  const { data: userHomes, isLoading: isLoadingHomes } = useQuery({
    queryKey: ["userHomes", selectedUserId],
    queryFn: () => fetchHomesByUserId(selectedUserId),
    enabled: !!selectedUserId,
  });

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label
          htmlFor="user-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select User:
        </label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => handleUserSelect(e)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {isLoadingUsers ? (
            <option>Loading users...</option>
          ) : (
            <option value="">Choose a user</option>
          )}
          {usersResponse?.data.map((user) => (
            <option key={user.uniqueId} value={user.uniqueId}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {selectedUserId && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">User's Homes</h2>
          <HomeListing
            homes={userHomes?.data}
            isLoading={isLoadingHomes}
            users={
              usersResponse?.data?.map((u) => {
                return { ...u, isSelected: false };
              }) || []
            }
            isLoadingAllUsers={isLoadingUsers}
          />
        </div>
      )}
    </div>
  );
}

export default App;
