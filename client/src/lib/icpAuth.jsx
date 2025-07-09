import { AuthClient } from '@dfinity/auth-client';
import { createContext, useContext, useEffect, useState } from 'react';
import { HttpAgent } from '@dfinity/agent';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        
        setIdentity(identity);
        setPrincipal(principal);

        // Create agent with authenticated identity - keeping the working configuration
        const agent = new HttpAgent({
          identity,
          host: import.meta.env.DEV ? 'http://127.0.0.1:4943' : 'https://ic0.app',
          verifyQuerySignatures: false, // Disable signature verification for local development
        });

        // Disable certificate verification for local development
        if (import.meta.env.DEV) {
          try {
            await agent.fetchRootKey();
            console.log('Root key fetched successfully for authenticated agent');
          } catch (error) {
            console.warn('Failed to fetch root key:', error);
          }
        }

        setAgent(agent);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      const APP_NAME = "HealthChain dApp";
      const APP_LOGO = "https://healthchain.example.com/logo.png"; // Replace with your logo
      const MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000); // 7 days in nanoseconds

      // Get Internet Identity URL
      const getIdentityProvider = () => {
        // Use production Internet Identity even in development
        // This was the working configuration
        return "https://identity.ic0.app";
      };

      const identityProvider = getIdentityProvider();
      console.log('Identity provider URL:', identityProvider);

      await new Promise((resolve) => {
        console.log('Starting login with provider:', identityProvider);
        
        const loginOptions = {
          identityProvider,
          maxTimeToLive: MAX_TIME_TO_LIVE,
          onSuccess: () => {
            console.log('Login successful');
            resolve();
          },
          onError: (error) => {
            console.error('Login failed:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            resolve();
          },
        };
        
        authClient.login(loginOptions);
      });

      // Reinitialize auth state after login
      await initAuth();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
      setAgent(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    isAuthenticated,
    identity,
    principal,
    agent,
    login,
    logout,
    loading,
    // Legacy compatibility
    user: isAuthenticated ? { 
      username: principal?.toString().slice(0, 8) + '...',
      principal: principal?.toString() 
    } : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
