import React, { useState, useContext } from "react";
import { useRouter, router } from "next/router";
import { useLogin } from "../../hooks/useUserActions";
import UserContext from "@/context/userContext";

export default function LoginForm() {
  const { setUser } = useContext(UserContext);
  const { handleLogin } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    const { email, password } = formData;
    try {
      const response = await handleLogin(email, password);
      console.log("Login successful:", response);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem('userRole',response.user.role);

      // localStorage.setItem('user', JSON.stringify(response.user));
      const savedUser = JSON.stringify(response.user);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        console.log(" saved user info!");
      } else {
        console.log("no saved user info!");
      }
      const userRole = response.user.role;
      // setUser(response.user);
      // Assuming the response contains the user's username
      if (userRole === "admin") {
        router.push("/admin");
      } else if(userRole === "professor"){
        router.push("/professor");
      }else{
        console.log("not an admin!");
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#1a1a2e] text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="relative mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="absolute w-[8rem] h-[8rem] bg-[#0f3460] rounded-full top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="border hsla(0,0%,65%,0.158) shadow-lg rounded-xl p-8 backdrop-blur-md">
          <form
            className="space-y-6"
            onSubmit={onSubmit}
            action="#"
            method="POST"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-[#9191911f] border-0 py-1.5 text-white focus:ring-2 focus:ring-offset-2 focus:ring-[#0f3460] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="/auth/forgot-password"
                    className="font-semibold hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md bg-[#9191911f] border-0 py-1.5 text-white focus:ring-2 focus:ring-offset-2 focus:ring-[#0f3460] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-[#0f3460] px-4 py-2 text-sm font-semibold leading-6 text-white hover:bg-opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-[#0f3460]"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm">
            Not a member?{" "}
            <a href="#" className="font-semibold hover:underline">
              Start a 14 day free trial
            </a>
          </p>
        </div>
        <div className="absolute w-[8rem] h-[8rem] bg-[#0f3460] rounded-full bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
}
