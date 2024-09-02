import { useState, useMemo } from "react";
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

const useUsers = () => {
  return useQuery<UserResponse>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};

const useUserHomes = (userId: string) => {
  return useQuery({
    queryKey: ["userHomes", userId],
    queryFn: () => fetchHomesByUserId(userId),
    enabled: !!userId,
  });
};

function App() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers();
  const { data: userHomes, isLoading: isLoadingHomes } =
    useUserHomes(selectedUserId);

  const handleUserSelect = useMemo(
    () => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedUserId(e.target.value);
    },
    []
  );

  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-6">
        <label
          htmlFor="user-select"
          className=" text-lg font-medium text-gray-700 mr-4"
        >
          Select User:
        </label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={handleUserSelect}
          className="py-2 px-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            User's Homes
          </h2>
          <div>
            <HomeListing
              homes={userHomes?.data}
              isLoading={isLoadingHomes}
              users={
                usersResponse?.data?.map((u) => ({
                  ...u,
                  isSelected: u.uniqueId === selectedUserId,
                })) || []
              }
              isLoadingAllUsers={isLoadingUsers}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
