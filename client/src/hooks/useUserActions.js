import { useState } from 'react';
import { loginUser, registerUser, changePassword } from '@/utils/api';
export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
 
      const handleLogin = async (email, password) => {
        setIsLoading(true);
        try {
          console.log("Sending API request");

          const data = await loginUser(email, password);
          setIsLoading(false);
          console.log("API request successful:", data);
          return data;
        } catch (err) {
          setIsLoading(false);
          setError(err);
          console.error("API request failed:", err);

        }
      };
    
  return { handleLogin, isLoading, error };
};
export const useRegister = () => {
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
    
      const handleRegister = async (email, password, username) => {
        setIsLoading(true);
        try {
          console.log("Sending API request");
          const data = await registerUser(email, password, username);
          setIsLoading(false);
          console.log("API request successful:", data);
          return data;
        } catch (err) {
          setIsLoading(false);
          setError(err);
          console.error("API request failed:", err);
        }
      };
    
      return { handleRegister, isLoading, error};
    };
    export const useChangePassword = () => {
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
    
      const handleChangePassword = async (id,  oldPassword, newPassword) => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('token');
          const data = await changePassword( id, oldPassword, newPassword, token);
          setIsLoading(false);
          return data;
        } catch (err) {
          setIsLoading(false);
          setError(err);
          throw err;
        }
      };
    
      return { handleChangePassword, isLoading, error };
    };
  