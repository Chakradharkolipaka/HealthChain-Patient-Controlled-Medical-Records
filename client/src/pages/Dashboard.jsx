import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CloudUpload, 
  ShieldCheck, 
  Info, 
  FolderOpen
} from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecordCard from "@/components/RecordCard";
import { useAuth } from "@/lib/icpAuth";
import { useToast } from "@/hooks/use-toast";
import { createAuthenticatedAPI } from "@/services/authenticatedApi";
import { testCanisterConnection, testUnauthenticatedConnection } from "@/services/testApi";
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

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, agent, identity } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Create authenticated API instance
  const api = agent ? createAuthenticatedAPI(agent) : null;

  // Fetch records from ICP backend
  const fetchRecords = async () => {
    setLoading(true);
    try {
      // First try unauthenticated test to check if canisters are accessible
      console.log('Testing unauthenticated connection...');
      const unauthTest = await testUnauthenticatedConnection();
      console.log('Unauthenticated test result:', unauthTest);
      
      if (!unauthTest.success && unauthTest.error.includes('certificate')) {
        toast({
          title: "Connection Error",
          description: "Certificate verification failed. Check dfx local network.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // If unauthenticated test passes, try authenticated
      if (!identity) {
        console.log('No identity available');
        setLoading(false);
        return;
      }
      
      // Use test API to debug connection issues
      const result = await testCanisterConnection(identity);
      if (result.success) {
        // Transform records to match UI expectations
        const transformedRecords = result.records.map(record => ({
          ...record,
          id: Number(record.id),
          type: record.record_type
        }));
        setRecords(transformedRecords);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch records: " + result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({
        title: "Error",
        description: "Failed to connect to backend",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }

    // Fetch records from ICP backend
    if (user) {
      fetchRecords();
    }
  }, [user, agent, setLocation]);

  const showConfirmation = (title, message, onConfirm) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  const hideConfirmation = () => {
    setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
  };

  const handleShareProvider = async (recordId) => {
    if (!api) return;
    
    showConfirmation(
      'Share with Healthcare Provider',
      'Are you sure you want to share this medical record with healthcare providers? They will have access to view and download the record.',
      async () => {
        try {
          // Use a placeholder principal for healthcare providers
          const providerPrincipal = "healthcare-provider-principal";
          const result = await api.accessControl.grantAccess(recordId, providerPrincipal);
          
          if (result.success) {
            toast({
              title: "Record shared",
              description: "Record shared with healthcare providers.",
            });
            // Refresh records to show updated sharing status
            fetchRecords();
          } else {
            toast({
              title: "Error",
              description: "Failed to share record: " + result.error,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error sharing record:', error);
          toast({
            title: "Error",
            description: "Failed to share record",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleShareResearcher = async (recordId) => {
    if (!api) return;
    
    showConfirmation(
      'Share with Medical Researchers',
      'Are you sure you want to share this medical record with medical researchers? Your data will be anonymized and used for research purposes only.',
      async () => {
        try {
          // Use a placeholder principal for researchers
          const researcherPrincipal = "medical-researcher-principal";
          const result = await api.accessControl.grantAccess(recordId, researcherPrincipal);
          
          if (result.success) {
            toast({
              title: "Record shared",
              description: "Record shared with medical researchers.",
            });
            // Refresh records to show updated sharing status
            fetchRecords();
          } else {
            toast({
              title: "Error",
              description: "Failed to share record: " + result.error,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error sharing record:', error);
          toast({
            title: "Error",
            description: "Failed to share record",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back, {user.username}
            </h1>
            <p className="text-slate-600">Manage your medical records and access permissions</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setLocation("/upload")}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <CloudUpload className="text-medical-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Upload Records</h3>
                    <p className="text-sm text-slate-600">Add new medical documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setLocation("/access-control")}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-medical-secondary/10 rounded-lg flex items-center justify-center mr-4">
                    <ShieldCheck className="text-medical-secondary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Access Control</h3>
                    <p className="text-sm text-slate-600">Manage sharing permissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setLocation("/privacy")}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-medical-accent/10 rounded-lg flex items-center justify-center mr-4">
                    <Info className="text-medical-accent h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Privacy Info</h3>
                    <p className="text-sm text-slate-600">Learn about data security</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Your Medical Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary mx-auto mb-4"></div>
                  <p className="text-lg text-slate-500">Loading your records...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg text-slate-500 mb-4">No medical records uploaded yet</p>
                  <Button 
                    onClick={() => setLocation("/upload")}
                    className="bg-medical-primary hover:bg-medical-primary/90 text-white"
                  >
                    Upload your first record
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      onShareProvider={handleShareProvider}
                      onShareResearcher={handleShareResearcher}
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
