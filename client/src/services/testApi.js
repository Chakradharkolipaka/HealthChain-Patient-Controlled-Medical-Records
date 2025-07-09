// Test API to debug the canister connection
import { HttpAgent, Actor, AnonymousIdentity } from '@dfinity/agent';
import {
  PATIENT_RECORDS_CANISTER_ID,
  ACCESS_CONTROL_CANISTER_ID,
} from './icpAgent.js';

// Import IDL definitions from icpAgent.js
import { patientRecordsIDL } from './icpAgent.js';

// Helper to get principal string
const getPrincipalString = (identity) => {
  try {
    return identity && identity.getPrincipal ? identity.getPrincipal().toText() : 'anonymous';
  } catch {
    return 'anonymous';
  }
};

export const createTestAgent = async (identity) => {
  const agent = new HttpAgent({
    identity,
    host: 'http://127.0.0.1:4943',
    verifyQuerySignatures: false, // Key fix: disable signature verification
  });
  try {
    await agent.fetchRootKey();
    console.log('Root key fetched successfully');
  } catch (error) {
    console.warn('Failed to fetch root key:', error);
  }
  return agent;
};

export const testCanisterConnection = async (identity) => {
  const principal = getPrincipalString(identity);
  try {
    const agent = await createTestAgent(identity);
    const actor = Actor.createActor(patientRecordsIDL, {
      agent,
      canisterId: PATIENT_RECORDS_CANISTER_ID,
    });
    console.log(`Testing canister connection as principal: ${principal}`);
    const records = await actor.get_my_records();
    console.log('Records retrieved:', records);
    return { success: true, records };
  } catch (error) {
    console.error(`Test failed for principal ${principal}:`, error);
    return { success: false, error: error.message };
  }
};

export const testAddRecord = async (identity, name, recordType, date, size, data, notes, uploadedAt) => {
  const principal = getPrincipalString(identity);
  if (principal === 'anonymous') {
    console.warn('Warning: Attempting to add record with anonymous identity. This will likely fail if the canister requires authentication.');
  }
  try {
    const agent = await createTestAgent(identity);
    const actor = Actor.createActor(patientRecordsIDL, {
      agent,
      canisterId: PATIENT_RECORDS_CANISTER_ID,
    });
    console.log(`Testing add record as principal: ${principal}`);
    const recordId = await actor.add_record(name, recordType, date, size, data, notes, uploadedAt);
    console.log('Record added with ID:', recordId);
    return { success: true, recordId: Number(recordId) };
  } catch (error) {
    console.error(`Add record test failed for principal ${principal}:`, error);
    return { success: false, error: error.message };
  }
};

export const testUnauthenticatedConnection = async () => {
  try {
    const agent = new HttpAgent({ 
      host: 'http://127.0.0.1:4943',
      verifyQuerySignatures: false // Key fix: disable signature verification
    });
    await agent.fetchRootKey();
    const actor = Actor.createActor(patientRecordsIDL, {
      agent,
      canisterId: PATIENT_RECORDS_CANISTER_ID,
    });
    console.log('Testing unauthenticated canister connection...');
    try {
      const recordId = await actor.add_record("Test", "prescription", "2024-01-01", "1MB", "test", "notes", "2024-01-01T00:00:00Z");
      console.log('Unauthenticated add record succeeded (unexpected):', recordId);
    } catch (error) {
      console.log('Unauthenticated add record failed (expected):', error.message);
      if (error.message.includes('certificate') || error.message.includes('signature')) {
        return { success: false, error: 'Certificate error in unauthenticated test: ' + error.message };
      }
    }
    return { success: true, message: 'Unauthenticated test passed - no certificate errors' };
  } catch (error) {
    console.error('Unauthenticated test failed:', error);
    return { success: false, error: error.message };
  }
};
