import React, { useState, useEffect } from "react";
import { IconCirclePlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../../context/index";
import CreateRecordModal from "./components/create-record-modal";
import RecordCard from "./components/record-card";

const Index = () => {
  const navigate = useNavigate();
  const { user } = usePrivy();
  const {
    records,
    fetchUserRecords,
    createRecord,
    fetchUserByEmail,
    currentUser,
  } = useStateContext();
  const [userRecords, setUserRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (user?.email?.address) {
        try {
          setIsInitializing(true);
          await fetchUserByEmail(user.email.address);
          await fetchUserRecords(user.email.address);
        } catch (error) {
          console.error("Error initializing user:", error);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeUser();
  }, [user, fetchUserByEmail, fetchUserRecords]);

  useEffect(() => {
    // If we're done initializing and there's no current user, redirect to onboarding
    if (!isInitializing && !currentUser && user?.email?.address) {
      navigate("/onboarding");
    }
  }, [isInitializing, currentUser, user, navigate]);

  useEffect(() => {
    setUserRecords(records);
    localStorage.setItem("userRecords", JSON.stringify(records));
  }, [records]);

  const handleOpenModal = () => {
    if (!currentUser) {
      setError("Please complete onboarding first");
      navigate("/onboarding");
      return;
    }
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setError("");
    setIsModalOpen(false);
  };

  const createFolder = async (foldername) => {
    try {
      setIsLoading(true);
      setError("");

      if (!currentUser) {
        navigate("/onboarding");
        throw new Error("Please complete onboarding first");
      }

      // Check if a record with this name already exists
      const existingRecord = userRecords.find(
        (record) => record.recordName.toLowerCase() === foldername.toLowerCase()
      );
      
      if (existingRecord) {
        throw new Error("A record with this name already exists.");
      }

      const newRecord = await createRecord({
        userId: currentUser.id,
        recordName: foldername,
        analysisResult: "",  // Initialize with empty string as per schema
        kanbanRecords: "",   // Initialize with empty string as per schema
        createdBy: user.email.address,
      });

      if (!newRecord) {
        throw new Error("Failed to create record. Please try again.");
      }

      await fetchUserRecords(user.email.address);
      handleCloseModal();
    } catch (e) {
      console.error("Error creating record:", e);
      setError(e.message || "Failed to create record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (name) => {
    const filteredRecords = userRecords.filter(
      (record) => record.recordName === name
    );
    
    if (filteredRecords.length === 0) {
      setError("Record not found");
      return;
    }
    
    navigate(`/medical-records/${name}`, {
      state: filteredRecords[0],
    });
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
          <p className="mt-2 text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/50">
          <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-[26px]">
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
          onClick={handleOpenModal}
          disabled={isLoading || !currentUser}
        >
          <IconCirclePlus />
          {isLoading ? "Creating..." : "Create Record"}
        </button>

        <CreateRecordModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={createFolder}
        />

        <div className="grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {userRecords?.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
