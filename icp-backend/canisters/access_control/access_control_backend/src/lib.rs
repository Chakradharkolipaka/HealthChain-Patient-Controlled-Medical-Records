use std::collections::{HashMap, HashSet};

type RecordId = u64;
type Principal = String;

thread_local! {
    // Map from record id to set of principals with access
    static ACCESS: std::cell::RefCell<HashMap<RecordId, HashSet<Principal>>> = std::cell::RefCell::new(HashMap::new());
}

#[ic_cdk::update]
fn grant_access(record_id: RecordId, grantee: Principal) {
    ACCESS.with(|access| {
        let mut access = access.borrow_mut();
        access.entry(record_id).or_default().insert(grantee);
    });
}

#[ic_cdk::update]
fn revoke_access(record_id: RecordId, grantee: Principal) {
    ACCESS.with(|access| {
        if let Some(set) = access.borrow_mut().get_mut(&record_id) {
            set.remove(&grantee);
        }
    });
}

#[ic_cdk::query]
fn has_access(record_id: RecordId, principal: Principal) -> bool {
    ACCESS.with(|access| {
        access
            .borrow()
            .get(&record_id)
            .map_or(false, |set| set.contains(&principal))
    })
}

#[ic_cdk::query]
fn get_grantees(record_id: RecordId) -> Vec<Principal> {
    ACCESS.with(|access| {
        access
            .borrow()
            .get(&record_id)
            .map(|set| set.iter().cloned().collect())
            .unwrap_or_default()
    })
}