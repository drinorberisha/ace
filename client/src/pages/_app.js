// src/pages/_app.js
import { useState, useEffect, useContext } from "react";
import "../../styles/globals.css";
import UserContext from "../context/userContext";
import { useRouter } from "next/router";
import { NextUIProvider } from "@nextui-org/react";
import { fetchUserProfile } from "@/utils/api";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      if (token) {
        try {
          // Replace this with your API call to fetch the user data using the token
          const userData = await fetchUserProfile(role, token);
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component or spinner
  }

  return (
    <NextUIProvider  navigate={router.push}>
      <UserContext.Provider value={{ user, setUser }}>
        <NextThemesProvider attribute="class" defaultTheme="dark">            
          <Component {...pageProps} />
        </NextThemesProvider>
      </UserContext.Provider>
    </NextUIProvider>
  );
}

export default MyApp;
