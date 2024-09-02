import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsersByHomeId, updateHomeUsers } from "../utils/api";

interface Home {
  id: number;
  uniqueId: string;
  street_address: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  list_price: number;
}

interface User {
  id: number;
  uniqueId: string;
  username: string;
  email: string;
  isSelected?: boolean;
}

interface HomeListingProps {
  homes: Home[] | undefined;
  isLoading: boolean;
  users: User[];
  isLoadingAllUsers: boolean;
}

const HomeListing: React.FC<HomeListingProps> = ({
  homes,
  isLoading,
  users,
  isLoadingAllUsers,
}) => {
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [errorUsers, setErrorUsers] = useState<string>("");

  const { data: selectedHomeUsers, isLoading: isLoadingHomeUsers } = useQuery({
    queryKey: ["homeUsers", selectedHome?.uniqueId],
    queryFn: () => fetchUsersByHomeId(selectedHome!.uniqueId),
  });

  useEffect(() => {
    console.log("selectedHomeUsers", selectedHomeUsers, users);
    const updatedUsers = users.map((user) => {
      if (
        selectedHomeUsers?.data?.some(
          (homeUser: User) => homeUser.id === user.id
        )
      ) {
        console.log("user", { ...user, isSelected: true });

        return { ...user, isSelected: true };
      }
      return user;
    });

    console.log("upDated", updatedUsers);

    setAllUsers(updatedUsers);
  }, [selectedHomeUsers]);

  if (isLoading) {
    return <div className="text-center">Loading homes...</div>;
  }

  if (!homes || homes.length === 0) {
    return <div className="text-center">No homes found for this user.</div>;
  }

  const openModal = (home: Home) => {
    setSelectedHome(home);
  };

  const closeModal = () => {
    setSelectedHome(null);
  };

  const validateUsers = () => {
    setErrorUsers("");

    const isValid = allUsers.some((user: User) => user.isSelected);

    if (!isValid) {
      setErrorUsers("Please select at least one user.");
    }

    return isValid;
  };

  const handleUpdateHomeUser = async () => {
    if (!validateUsers()) return;

    const selectedUserIds = allUsers
      .filter((user: User) => user.isSelected)
      .map((user: User) => user.id);

    await updateHomeUsers(selectedHome!.uniqueId, selectedUserIds);

    closeModal();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homes?.map((home) => (
          <div
            key={home.uniqueId}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {home.street_address}
              </h3>
              <p className="text-gray-600 mb-2">
                {home.state}, {home.zip}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{home.beds} beds</span>
                <span>{home.baths} baths</span>
                <span>{home.sqft.toFixed(0)} sqft</span>
              </div>
              <p className="text-lg font-bold text-indigo-600 mb-2">
                ${home.list_price.toLocaleString()}
              </p>
              <button
                onClick={() => openModal(home)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
              >
                Edit Users
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedHome && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Users for {selectedHome.street_address}
            </h2>
            {isLoadingAllUsers || isLoadingHomeUsers ? (
              <p>Loading users...</p>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {allUsers?.map((user: User) => (
                  <div key={user.uniqueId} className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id={user.uniqueId}
                      defaultChecked={user.isSelected}
                      onChange={() => (user.isSelected = !user.isSelected)}
                      className="mr-2"
                    />
                    <label htmlFor={user.uniqueId}>
                      <span className="font-semibold">{user.username}</span> -{" "}
                      {user.email}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {errorUsers && (
              <div className="text-red-500 mt-2">{errorUsers}</div>
            )}

            <div className="mt-4 flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateHomeUser}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300"
                disabled={!!errorUsers}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeListing;
