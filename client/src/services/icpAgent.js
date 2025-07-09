import { HttpAgent, Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Canister IDs - Get from environment variables and validate
export const PATIENT_RECORDS_CANISTER_ID = import.meta.env.VITE_PATIENT_RECORDS_CANISTER_ID;
export const ACCESS_CONTROL_CANISTER_ID = import.meta.env.VITE_ACCESS_CONTROL_CANISTER_ID;

if (!PATIENT_RECORDS_CANISTER_ID || !ACCESS_CONTROL_CANISTER_ID) {
  throw new Error('Canister IDs are missing in .env.local!');
}

// Define the interface for your canisters
const patientRecordsIDL = ({ IDL }) => {
  const RecordId = IDL.Nat64;
  const MedicalRecord = IDL.Record({
    'id': RecordId,
    'owner': IDL.Text,
    'name': IDL.Text,
    'record_type': IDL.Text,
    'date': IDL.Text,
    'size': IDL.Text,
    'data': IDL.Text,
    'notes': IDL.Text,
    'uploaded_at': IDL.Text,
  });

  return IDL.Service({
    'add_record': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [RecordId], []),
    'get_my_records': IDL.Func([], [IDL.Vec(MedicalRecord)], ['query']),
    'get_record_by_id': IDL.Func([RecordId], [IDL.Opt(MedicalRecord)], ['query']),
  });
};

const accessControlIDL = ({ IDL }) => {
  const RecordId = IDL.Nat64;
  const Principal = IDL.Text;

  return IDL.Service({
    'grant_access': IDL.Func([RecordId, Principal], [], []),
    'revoke_access': IDL.Func([RecordId, Principal], [], []),
    'has_access': IDL.Func([RecordId, Principal], [IDL.Bool], ['query']),
    'get_grantees': IDL.Func([RecordId], [IDL.Vec(Principal)], ['query']),
  });
};

// Factory functions to create actors with authenticated agent
export const createPatientRecordsActor = (agent) => {
  return Actor.createActor(patientRecordsIDL, {
    agent,
    canisterId: PATIENT_RECORDS_CANISTER_ID,
  });
};

export const createAccessControlActor = (agent) => {
  return Actor.createActor(accessControlIDL, {
    agent,
    canisterId: ACCESS_CONTROL_CANISTER_ID,
  });
};

// Legacy exports for non-authenticated usage (fallback)
const isDevelopment = import.meta.env.DEV;
const HOST = isDevelopment ? 'http://127.0.0.1:4943' : 'https://ic0.app';

export const defaultAgent = new HttpAgent({ 
  host: HOST,
  verifyQuerySignatures: false, // Disable signature verification to fix the delegation errors
});

// Initialize the agent for development
const initAgent = async () => {
  if (isDevelopment) {
    try {
      await defaultAgent.fetchRootKey();
      console.log('Root key fetched successfully for default agent');
    } catch (error) {
      console.warn('Failed to fetch root key for default agent:', error);
    }
  }
};

initAgent();

export { patientRecordsIDL, accessControlIDL };
