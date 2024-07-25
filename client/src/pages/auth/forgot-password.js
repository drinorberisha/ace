import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Login from "./login";
import { resetForgotPassword, sendForgotPasswordEmail, verifyForgotPasswordCode } from "@/utils/api";

const ForgotPasswordComponent = () => {
  const [forgotModal, setForgotModal] = useState(true);
  const [verifyModal, setVerifyModal] = useState(false);
  const [afterForgotPassword, setAfterForgotPassword] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [inputvalue, setInputvalue] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const [showLogin, setShowLogin] = useState(false);
  const router  = useRouter();
  const handleSubmit = async (e) => {
    try {
      const res = await sendForgotPasswordEmail(inputvalue.email);
      if (res?.message === "OTP sent to email") {
      console.log("resss");
      setForgotModal(false);
      setVerifyModal(true);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleVerify = async (e) => {
    const data = {
      email: inputvalue.email,
      code: inputvalue.otp,
    };
    try {
      const res = await verifyForgotPasswordCode(data.email,data.code);
      if (res?.message === "OTP verified") {
      console.log("resss");
      setTempToken(res.tempToken);
      setVerifyModal(false);
      setAfterForgotPassword(true);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const handleAfterForgotPass = async (e) => {
    const data = {
      tempToken: tempToken,
      newPassword: inputvalue.password,
    };
    try {
      const res = await resetForgotPassword(data.tempToken,data.newPassword)
      if (res?.message === "Password reset successfully") {
      console.log("resss");
      router.push("/auth/login");
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Forgot Password */}
      {forgotModal && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h3 className="text-2xl font-semibold mb-4">Forgot Password</h3>

          <input
            className="block w-full p-3 mb-4 border rounded-md"
            type="email"
            placeholder="Enter your email"
            value={inputvalue.email}
            onChange={(e) =>
              setInputvalue({ ...inputvalue, email: e.target.value })
            }
          />

          <button
            className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleSubmit}
          >
            Send Verification Code
          </button>

          <div className="text-center">
            Sie haben ein Konto?
            {/* <Link href="/auth/login" passHref>
              <a className="ml-2 text-blue-500 hover:underline">Anmelden</a>
            </Link> */}
          </div>
        </div>
      )}

      {/* Verify code */}
      {verifyModal && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h3 className="text-2xl font-semibold mb-4">Verify Code</h3>

          <input
            className="block w-full p-3 mb-4 border rounded-md"
            type="text"
            placeholder="Enter OTP"
            value={inputvalue.otp}
            onChange={(e) =>
              setInputvalue({ ...inputvalue, otp: e.target.value })
            }
          />

          <button
            className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleVerify}
          >
            Verify Code
          </button>
        </div>
      )}

      {/* After forgot password */}
      {afterForgotPassword && (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h3 className="text-2xl font-semibold mb-4">Reset Password</h3>

          <input
            className="block w-full p-3 mb-4 border rounded-md"
            type="password"
            placeholder="Enter new password"
            value={inputvalue.password}
            onChange={(e) =>
              setInputvalue({ ...inputvalue, password: e.target.value })
            }
          />

          <button
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={handleAfterForgotPass}
          >
            Reset Password
            {showLogin && <Login />}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordComponent;
