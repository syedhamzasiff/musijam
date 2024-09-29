import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;


//Register user function
export const registerUser = async (userData: { email: string; username: string; password: string }) => {
    try {
      const response = await axios.post(`${apiUrl}/register`, userData, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      console.error("Error registering user", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Registration failed');
    }
  };


//Login user function
export const loginUser = async (userData: { emailOrUsername: string; password: string }) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, userData, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      console.error("Error logging in user", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Login failed');
    }
  };

// Logout user function
export const logoutUser = async () => {
    try {
      const response = await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      console.error("Error logging out user", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message || 'Logout failed');
    }
  };