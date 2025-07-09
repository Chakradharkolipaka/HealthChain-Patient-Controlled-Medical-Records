import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadForm from "@/components/UploadForm";
import { useAuth } from "@/lib/icpAuth";
import { useToast } from "@/hooks/use-toast";
import { createAuthenticatedAPI } from "@/services/authenticatedApi";
import { testAddRecord } from "@/services/testApi";

export default function Upload() {
  const [, setLocation] = useLocation();
  const { user, agent, identity } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Create authenticated API instance
  const api = agent ? createAuthenticatedAPI(agent) : null;

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const handleUpload = async (uploadData) => {
    if (!identity) {
      toast({
        title: "Error",
        description: "Please authenticate first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      toast({
        title: "Uploading record...",
        description: "Please wait while we securely store your medical record.",
      });
      
      // Prepare record data for ICP backend
      const recordData = {
        name: uploadData.name,
        type: uploadData.type,
        date: uploadData.date,
        size: (uploadData.file.size / (1024 * 1024)).toFixed(1) + ' MB',
        data: JSON.stringify({
          fileName: uploadData.file.name,
          // In production, you would upload the file to IPFS or similar
          // and store the hash here instead of the full file
        }),
        notes: uploadData.notes || '',
        uploadedAt: new Date().toISOString()
      };
      
      // Send record to ICP canister using test API
      const result = await testAddRecord(
        identity,
        recordData.name,
        recordData.type,
        recordData.date,
        recordData.size,
        recordData.data,
        recordData.notes,
        recordData.uploadedAt
      );
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your medical record has been securely uploaded and stored.",
        });
        
        // Redirect to dashboard
        setLocation("/dashboard");
      } else {
        throw new Error(result.error || 'Failed to upload record');
      }
      
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your record. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setLocation("/dashboard");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Medical Records</h1>
            <p className="text-slate-600">
              Securely add new medical documents to your blockchain-protected records
            </p>
          </div>

          <UploadForm 
            onSubmit={handleUpload}
            onCancel={handleCancel}
            disabled={isUploading}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
