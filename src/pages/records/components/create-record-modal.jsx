import React, { useState } from "react";
import Modal from "./Modal";

const CreateRecordModal = ({ isOpen, onClose, onCreate }) => {
  const [foldername, setFoldername] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    // Validate input
    if (!foldername.trim()) {
      setError("Record name is required");
      return;
    }
    
    // Clear any previous errors
    setError("");
    
    // Call onCreate with validated data
    onCreate(foldername.trim());
    setFoldername("");
  };

  const handleClose = () => {
    setFoldername("");
    setError("");
    onClose();
  };

  return (
    <Modal
      title="Create Record"
      isOpen={isOpen}
      onClose={handleClose}
      onAction={handleCreate}
      actionLabel="Create Folder"
    >
      <div className="grid gap-y-4">
        <div>
          <label
            htmlFor="folder-name"
            className="mb-2 block text-sm dark:text-white"
          >
            Record Name
          </label>
          <div className="relative">
            <input
              value={foldername}
              onChange={(e) => {
                setError("");
                setFoldername(e.target.value);
              }}
              type="text"
              className={`block w-full rounded-lg border-2 px-4 py-3 text-sm focus:border-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 ${
                error ? "border-red-500" : ""
              }`}
              placeholder="Enter record name"
              required
            />
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateRecordModal;
