use ic_cdk::api::caller;
use std::collections::HashMap;

type RecordId = u64;
type Principal = String;

#[derive(Clone, Debug, candid::CandidType, serde::Serialize, serde::Deserialize)]
pub struct MedicalRecord {
    pub id: RecordId,
    pub owner: Principal,
    pub name: String,
    pub record_type: String, // prescription, lab-report, imaging, consultation, vaccination, other
    pub date: String, // Date of the medical event
    pub size: String, // File size (e.g., "2.5 MB")
    pub data: String, // In production, use encrypted data or IPFS hash
    pub notes: String, // Additional notes
    pub uploaded_at: String, // When it was uploaded
}

thread_local! {
    static RECORDS: std::cell::RefCell<HashMap<RecordId, MedicalRecord>> = std::cell::RefCell::new(HashMap::new());
    static NEXT_ID: std::cell::RefCell<RecordId> = std::cell::RefCell::new(1);
}

#[ic_cdk::update]
fn add_record(name: String, record_type: String, date: String, size: String, data: String, notes: String, uploaded_at: String) -> RecordId {
    let owner = caller().to_text();
    let id = NEXT_ID.with(|next| {
        let mut n = next.borrow_mut();
        let id = *n;
        *n += 1;
        id
    });
    let record = MedicalRecord { 
        id, 
        owner, 
        name, 
        record_type, 
        date, 
        size, 
        data, 
        notes, 
        uploaded_at 
    };
    RECORDS.with(|records| records.borrow_mut().insert(id, record));
    id
}

#[ic_cdk::query]
fn get_my_records() -> Vec<MedicalRecord> {
    let owner = caller().to_text();
    RECORDS.with(|records| {
        records
            .borrow()
            .values()
            .filter(|r| r.owner == owner)
            .cloned()
            .collect()
    })
}

#[ic_cdk::query]
fn get_record_by_id(id: RecordId) -> Option<MedicalRecord> {
    RECORDS.with(|records| records.borrow().get(&id).cloned())
}