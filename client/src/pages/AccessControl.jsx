import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessToggle from "@/components/AccessToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AccessControl() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }

    // Load records from localStorage
    const savedRecords = JSON.parse(localStorage.getItem('healthchain_records') || '[]');
    setRecords(savedRecords);
  }, [user, setLocation]);

  const showConfirmation = (title, message, onConfirm) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  const hideConfirmation = () => {
    setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
  };

  const handleToggleProvider = (recordId) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    if (record.sharedWithProviders) {
      // Revoking access
      showConfirmation(
        'Revoke Provider Access',
        'Are you sure you want to revoke healthcare provider access to this record? They will no longer be able to view or download it.',
        () => updateRecordAccess(recordId, 'sharedWithProviders', false, 'Provider access revoked')
      );
    } else {
      // Granting access
      showConfirmation(
        'Grant Provider Access',
        'Are you sure you want to grant healthcare providers access to this record? They will be able to view and download the record.',
        () => updateRecordAccess(recordId, 'sharedWithProviders', true, 'Provider access granted')
      );
    }
  };

  const handleToggleResearcher = (recordId) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    if (record.sharedWithResearchers) {
      // Revoking access
      showConfirmation(
        'Revoke Researcher Access',
        'Are you sure you want to revoke medical researcher access to this record? Your anonymized data will no longer be available for research.',
        () => updateRecordAccess(recordId, 'sharedWithResearchers', false, 'Researcher access revoked')
      );
    } else {
      // Granting access
      showConfirmation(
        'Grant Researcher Access',
        'Are you sure you want to grant medical researchers access to this record? Your data will be anonymized and used for research purposes only.',
        () => updateRecordAccess(recordId, 'sharedWithResearchers', true, 'Researcher access granted')
      );
    }
  };

  const updateRecordAccess = (recordId, field, value, message) => {
    // TODO: Connect with access control logic in backend canister (grant/revoke by Principal ID)
    const updatedRecords = records.map(record => 
      record.id === recordId 
        ? { ...record, [field]: value }
        : record
    );
    
    setRecords(updatedRecords);
    localStorage.setItem('healthchain_records', JSON.stringify(updatedRecords));
    
    toast({
      title: "Access updated",
      description: message,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Control</h1>
            <p className="text-slate-600">
              Manage who can access your medical records and when
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Record Access Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-slate-500">
                    No medical records to manage yet. Upload some records first.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map((record) => (
                    <AccessToggle
                      key={record.id}
                      record={record}
                      onToggleProvider={handleToggleProvider}
                      onToggleResearcher={handleToggleResearcher}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && hideConfirmation()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={hideConfirmation}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                confirmDialog.onConfirm?.();
                hideConfirmation();
              }}
              className="bg-medical-primary hover:bg-medical-primary/90"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </>
  );
}
