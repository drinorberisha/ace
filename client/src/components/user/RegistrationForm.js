import React, { useState } from "react";
import { useRegister } from "../../hooks/useUserActions";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const { handleRegister } = useRegister();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    bio: "",
    expertise: "",
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
    try {
      const { email, username, password } = formData;
      const response = await handleRegister(email, username, password);
      console.log("Registration successful:", response);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };
  const backgroundClass = showPassword
    ? "bg-[url('/registration/education1.webp')]" // Background when password is shown
    : "bg-[url('/registration/education.png')]"; // Default background

  return (
    <div
      className={`${backgroundClass} bg-no-repeat bg-cover bg-center min-h-screen flex items-center justify-center`}
    >
      {" "}
      <form
        onSubmit={onSubmit}
        className="space-y-4 w-full max-w-md mx-auto shadow-[0_20px_50px_20px_rgba(0,0,0,0.75)] rounded px-8 pt-6 pb-8 mb-4 opacity-250"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-white text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-white text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="bg-white bg-opacity-50 shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-white text-sm font-bold mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-white bg-opacity-50 shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
            >
              <img
                // src={showPassword ? 'hideIconUrl.png' : 'showIconUrl.png'}
                alt={showPassword ? "Hide" : "Show"} //Veq duhet mi gjet dy ikona cfare mi perdor se gati o kjo
              />
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-white text-sm font-bold mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="bg-white bg-opacity-50 shadow appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Tell us a bit about yourself"
          />
        </div>

        <div class="flex justify-center ">
          <button
            type="submit"
            className="bg-black hover:bg-white  hover:text-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-2 border-black"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
