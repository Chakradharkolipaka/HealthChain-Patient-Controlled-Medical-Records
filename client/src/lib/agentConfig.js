import { HttpAgent } from '@dfinity/agent';

export const createAgent = async (identity = null) => {
  const isDevelopment = import.meta.env.DEV;
  const host = isDevelopment ? 'http://127.0.0.1:4943' : 'https://ic0.app';
  
  const agentOptions = {
    host,
    verifyQuerySignatures: false, // Always disabled for local development consistency
  };
  
  if (identity) {
    agentOptions.identity = identity;
  }
  
  const agent = new HttpAgent(agentOptions);
  
  // Always fetch root key in development, regardless of identity
  if (isDevelopment) {
    try {
      await agent.fetchRootKey();
      console.log(`Root key fetched successfully for ${identity ? 'authenticated' : 'anonymous'} agent`);
    } catch (error) {
      console.warn('Failed to fetch root key:', error);
      throw error;
    }
  }
  
  return agent;
};

export const agentConfig = {
  development: {
    host: 'http://127.0.0.1:4943',
    verifyQuerySignatures: false,
    fetchRootKey: true,
  },
  production: {
    host: 'https://ic0.app',
    verifyQuerySignatures: true,
    fetchRootKey: false,
  }
};
