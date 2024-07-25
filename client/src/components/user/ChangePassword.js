// components/user/ChangePassword.js

import React from "react";
import { useState, useContext } from "react";
import { useChangePassword } from "../../hooks/useUserActions";
import UserContext from "@/context/userContext";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { user } = useContext(UserContext);
  const { handleChangePassword } = useChangePassword();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      console.error("New passwords do not match!");

      return;
    }
    try {
      const response = await handleChangePassword(
        user.id,
        formData.oldPassword,
        formData.newPassword
      );
      console.log("Password change successful:", response);
      toast.success("Password changed successfully!");
    } catch (err) {
      console.error("Password change failed:", err);
      toast.error("Password change failed. Please try again.");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4"></h2>

      <button
        className="px-6 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setShowForm(!showForm)} // Toggle the form visibility
      >
        Change Password
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="oldPassword" className="block mb-2">
              Old Password:
            </label>
            <input
              className="block w-full p-3 border rounded-md"
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block mb-2">
              New Password:
            </label>
            <input
              className="block w-full p-3 border rounded-md"
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block mb-2">
              Confirm New Password:
            </label>
            <input
              className="block w-full p-3 border rounded-md"
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
