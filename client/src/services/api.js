import { createPatientRecordsActor, createAccessControlActor, defaultAgent } from './icpAgent.js';

// Create actors with default agent (non-authenticated)
// Note: This is for backward compatibility. Use authenticatedApi.js for authenticated calls
const patientRecordsActor = createPatientRecordsActor(defaultAgent);
const accessControlActor = createAccessControlActor(defaultAgent);

// Patient Records API 
export const patientRecordsAPI = {
  // Add a new medical record
  async addRecord(name, recordType, date, size, data, notes, uploadedAt) {
    try {
      const recordId = await patientRecordsActor.add_record(name, recordType, date, size, data, notes, uploadedAt);
      return { success: true, recordId: Number(recordId) };
    } catch (error) {
      console.error('Error adding record:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all records for the current user
  async getMyRecords() {
    try {
      const records = await patientRecordsActor.get_my_records();
      return { 
        success: true, 
        records: records.map(record => ({
          ...record,
          id: Number(record.id), // Convert BigInt to number
          type: record.record_type // Map record_type to type for UI compatibility
        }))
      };
    } catch (error) {
      console.error('Error fetching records:', error);
      return { success: false, error: error.message };
    }
  },

  // Get a specific record by ID
  async getRecordById(recordId) {
    try {
      const result = await patientRecordsActor.get_record_by_id(BigInt(recordId));
      if (result.length > 0) {
        const record = result[0];
        return { 
          success: true, 
          record: {
            ...record,
            id: Number(record.id)
          }
        };
      } else {
        return { success: false, error: 'Record not found' };
      }
    } catch (error) {
      console.error('Error fetching record:', error);
      return { success: false, error: error.message };
    }
  }
};

// Access Control API
export const accessControlAPI = {
  // Grant access to a record
  async grantAccess(recordId, grantee) {
    try {
      await accessControlActor.grant_access(BigInt(recordId), grantee);
      return { success: true };
    } catch (error) {
      console.error('Error granting access:', error);
      return { success: false, error: error.message };
    }
  },

  // Revoke access to a record
  async revokeAccess(recordId, grantee) {
    try {
      await accessControlActor.revoke_access(BigInt(recordId), grantee);
      return { success: true };
    } catch (error) {
      console.error('Error revoking access:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if a principal has access to a record
  async hasAccess(recordId, principal) {
    try {
      const hasAccess = await accessControlActor.has_access(BigInt(recordId), principal);
      return { success: true, hasAccess };
    } catch (error) {
      console.error('Error checking access:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all grantees for a record
  async getGrantees(recordId) {
    try {
      const grantees = await accessControlActor.get_grantees(BigInt(recordId));
      return { success: true, grantees };
    } catch (error) {
      console.error('Error fetching grantees:', error);
      return { success: false, error: error.message };
    }
  }
};
