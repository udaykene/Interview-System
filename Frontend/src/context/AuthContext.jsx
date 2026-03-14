import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { AuthContext } from "./AuthContextState";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Expose the token from cookies or axios header if needed for socket
  const fetchMe = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  // Helper to extract JWT token from cookies for Socket.io
  const getToken = () => {
    const match = document.cookie.match(/(^| )jwt=([^;]+)/);
    return match ? match[2] : null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn: !!user,
        refresh: fetchMe,
        logout,
        token: getToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
