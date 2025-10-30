import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn("Could not load user data:", error);
    }
  }, []);

  // Login function
  const login = (email, password) => {
    // In a real app, you would validate against a backend
    // For now, we'll do simple validation
    
    // Check if user exists in localStorage (for returning users)
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(u => u.email === email && u.password === password);
      
      if (existingUser) {
        const userData = {
          name: existingUser.name,
          email: existingUser.email,
          avatar: existingUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(existingUser.name)}&background=1DB954&color=fff`
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  };

  // Register function
  const register = (name, email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return { success: false, error: "User already exists with this email" };
      }

      // Create new user
      const newUser = {
        name,
        email,
        password, // In production, NEVER store plain passwords!
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1DB954&color=fff`,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Auto login after registration
      const userData = {
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};