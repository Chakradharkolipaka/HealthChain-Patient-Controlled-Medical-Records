import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Download, 
  FileText, 
  TestTube, 
  FileImage, 
  Stethoscope, 
  Pill, 
  Syringe,
  FolderOpen,
  Calendar,
  User
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import mockSharedData from "@/mock/mockSharedToMe.json";

const getRecordIcon = (type) => {
  const icons = {
    'Lab Report': TestTube,
    'Imaging': FileImage,
    'Prescription': Pill,
    'Consultation': Stethoscope,
    'Vaccination': Syringe,
    'Other': FileText
  };
  return icons[type] || FileText;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function SharedToMe() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sharedRecords, setSharedRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }

    // TODO: Replace mock fetch with canister call to fetch records shared to current Principal ID
    // This should query the ICP canister for records where the current user's Principal ID
    // has been granted access by patients
    const loadSharedRecords = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, load mock data
        setSharedRecords(mockSharedData);
      } catch (error) {
        toast({
          title: "Error loading records",
          description: "Unable to load shared medical records.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSharedRecords();
  }, [user, setLocation, toast]);

  const handleViewRecord = (record) => {
    // TODO: On 'View', log access event to audit canister with timestamp and viewer identity
    // This should create an immutable audit log entry showing:
    // - Viewer Principal ID
    // - Record ID accessed
    // - Timestamp of access
    // - Action type (VIEW)
    
    toast({
      title: "Opening record",
      description: `Viewing ${record.name}`,
    });
    
    // Simulate opening PDF in new tab
    // In production, this would fetch the actual file from decentralized storage
    console.log(`Opening record: ${record.fileUrl}`);
    
    // For demo purposes, show alert since we don't have actual PDFs
    alert(`Would open PDF: ${record.name}\nFile URL: ${record.fileUrl}`);
  };

  const handleDownloadRecord = (record) => {
    // TODO: On 'Download', log access event to audit canister with timestamp and viewer identity
    // This should create an immutable audit log entry showing:
    // - Viewer Principal ID  
    // - Record ID accessed
    // - Timestamp of access
    // - Action type (DOWNLOAD)
    
    toast({
      title: "Downloading record",
      description: `Downloaded ${record.name}`,
    });
    
    // Simulate download
    // In production, this would fetch the encrypted file and decrypt it for authorized user
    console.log(`Downloading record: ${record.fileUrl}`);
    
    // For demo purposes, simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = record.name;
    link.click();
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading shared records...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Records Shared With Me
            </h1>
            <p className="text-slate-600">
              Medical records that patients have shared with you as a healthcare provider or researcher
            </p>
          </div>

          {/* Records Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Shared Medical Records ({sharedRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sharedRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg text-slate-500 mb-2">No records shared with you yet</p>
                  <p className="text-sm text-slate-400">
                    Patients can share their medical records with you from their dashboard
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Record</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Shared By</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Date Shared</th>
                            <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sharedRecords.map((record) => {
                            const IconComponent = getRecordIcon(record.type);
                            return (
                              <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="py-4 px-4">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 bg-medical-primary/10 rounded-lg flex items-center justify-center mr-3">
                                      <IconComponent className="text-medical-primary h-5 w-5" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900">{record.name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <Badge variant="secondary" className="bg-medical-secondary/10 text-medical-secondary">
                                    {record.type}
                                  </Badge>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center text-slate-600">
                                    <User className="h-4 w-4 mr-1" />
                                    {record.sharedBy}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center text-slate-600">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatDate(record.dateShared)}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button
                                      onClick={() => handleViewRecord(record)}
                                      size="sm"
                                      className="bg-medical-primary hover:bg-medical-primary/90 text-white"
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      onClick={() => handleDownloadRecord(record)}
                                      size="sm"
                                      variant="outline"
                                      className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary hover:text-white"
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {sharedRecords.map((record) => {
                      const IconComponent = getRecordIcon(record.type);
                      return (
                        <Card key={record.id} className="border border-slate-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-medical-primary/10 rounded-lg flex items-center justify-center mr-3">
                                  <IconComponent className="text-medical-primary h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">{record.name}</p>
                                  <Badge variant="secondary" className="bg-medical-secondary/10 text-medical-secondary text-xs mt-1">
                                    {record.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-slate-600 text-sm">
                                <User className="h-4 w-4 mr-2" />
                                Shared by: {record.sharedBy}
                              </div>
                              <div className="flex items-center text-slate-600 text-sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                {formatDate(record.dateShared)}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleViewRecord(record)}
                                size="sm"
                                className="bg-medical-primary hover:bg-medical-primary/90 text-white flex-1"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                onClick={() => handleDownloadRecord(record)}
                                size="sm"
                                variant="outline"
                                className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary hover:text-white flex-1"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}