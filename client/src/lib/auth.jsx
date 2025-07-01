import { useState, useEffect, createContext, useContext } from "react";
import { useLocation } from "wouter";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('healthchain_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('healthchain_user');
      }
    }
  }, []);

  const login = async (credentials) => {
    // TODO: Replace with Internet Identity or custom Auth Canister
    // Mock authentication
    if (credentials.username && credentials.password) {
      const userData = {
        username: credentials.username,
        loginTime: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('healthchain_user', JSON.stringify(userData));
      return userData;
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (userData) => {
    // TODO: Replace with Internet Identity or custom Auth Canister
    // Mock registration
    if (userData.username && userData.password) {
      const newUser = {
        username: userData.username,
        joinedAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('healthchain_user', JSON.stringify(newUser));
      return newUser;
    } else {
      throw new Error('Invalid user data');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthchain_user');
    localStorage.removeItem('healthchain_records');
    setLocation('/');
  };

  const value = {
    user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Wrap the app with AuthProvider
export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    );
  };
}
