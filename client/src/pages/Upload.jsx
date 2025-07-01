import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UploadForm from "@/components/UploadForm";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const handleUpload = async (uploadData) => {
    setIsUploading(true);
    
    try {
      // TODO: Send record + metadata to ICP canister for secure storage
      
      // Mock upload process
      toast({
        title: "Uploading record...",
        description: "Please wait while we securely store your medical record.",
      });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get existing records from localStorage
      const existingRecords = JSON.parse(localStorage.getItem('healthchain_records') || '[]');
      
      // Create new record
      const newRecord = {
        id: Date.now(),
        name: uploadData.name,
        type: uploadData.type,
        date: uploadData.date,
        size: (uploadData.file.size / (1024 * 1024)).toFixed(1) + ' MB',
        notes: uploadData.notes,
        sharedWithProviders: false,
        sharedWithResearchers: false,
        uploadedAt: new Date().toISOString()
      };
      
      // Add to records
      const updatedRecords = [...existingRecords, newRecord];
      localStorage.setItem('healthchain_records', JSON.stringify(updatedRecords));
      
      toast({
        title: "Record uploaded successfully!",
        description: "Your medical record has been securely stored on the blockchain.",
      });
      
      // Redirect to dashboard after successful upload
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
      
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
