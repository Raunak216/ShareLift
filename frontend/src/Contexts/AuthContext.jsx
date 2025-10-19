import { useContext, createContext, useState, useEffect } from "react";
import axios from "../axiosConfig.js";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const res = await axios.post(
        "/api/auth/refresh",
        {},
        { withCredentials: true }
      );
      return res.data.user;
    } catch (e) {
      setUser(null);
      return null;
    }
  };
  const checkUserStatus = async () => {
    let userFound = false;
    try {
      const res = await axios.get("/api/users/me", { withCredentials: true });
      setUser(res.data.user);
      userFound = true;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const refreshSuccess = await refreshSession();
        if (refreshSuccess) {
          userFound = true;
        } else {
          userFound = false;
        }
      } else {
        userFound = false;
      }
    } finally {
      if (!userFound) {
        setUser(null);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn: !!user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
