import React from "react";
import Navigation from "@/components/common/navigation";
import ChangePassword from "../../components/user/ChangePassword";
import UserProfile from "@/components/user/userProfile";
import Newnav from "@/components/common/newnav";

function Settings() {
  return (
    <div className=" h-screen">
      {/* <Navigation /> */}
      <Newnav/>
            <div className="max-w-4xl mx-auto my-12 p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Privacy Settings</h2>
          <ChangePassword />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Payment Settings</h2>
          {/* Payment related components go here */}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
          <button className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
            Delete Account
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Password Management</h2>
          {/* <ForgotPasswordComponent /> */}
          {/* <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {/* Forgot Password */}
          {/* </button>/ */}
        </div>

        {/* Additional settings sections can be added here */}
      </div>
    </div>
  );
}

export default Settings;
