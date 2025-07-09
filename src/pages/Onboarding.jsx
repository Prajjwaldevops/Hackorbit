import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { usePrivy } from "@privy-io/react-auth";

const Onboarding = () => {
  const { createUser, currentUser, fetchUserByEmail } = useStateContext();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = usePrivy();

  useEffect(() => {
    // If user is already onboarded, redirect to profile
    if (currentUser) {
      navigate("/profile");
    }
  }, [currentUser, navigate]);

  const handleOnboarding = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!user?.email?.address) {
        throw new Error("Please log in first");
      }

      const userData = {
        username: username.trim(),
        age: parseInt(age, 10),
        location: location.trim(),
        folders: [],
        treatmentCounts: 0,
        folder: [],
        createdBy: user.email.address,
      };

      // Validate data
      if (!userData.username) {
        throw new Error("Username is required");
      }
      if (isNaN(userData.age) || userData.age <= 0) {
        throw new Error("Please enter a valid age");
      }
      if (!userData.location) {
        throw new Error("Location is required");
      }

      const newUser = await createUser(userData);
      if (!newUser) {
        throw new Error("Failed to create user. Please try again.");
      }

      // Fetch the newly created user
      await fetchUserByEmail(user.email.address);
      navigate("/profile");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError(err.message || "Failed to complete onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#13131a]">
      <div className="w-full max-w-md rounded-xl bg-[#1c1c24] p-8 shadow-lg">
        <h2 className="mb-2 text-center text-5xl font-bold text-white">👋 </h2>
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Welcome! Let's get started
        </h2>
        {error && (
          <div className="mb-4 rounded-lg bg-red-900/50 p-4">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
        <form onSubmit={handleOnboarding}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="mb-2 block text-sm text-gray-300">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="1"
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="mb-2 block text-sm text-gray-300"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Get Started"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;


