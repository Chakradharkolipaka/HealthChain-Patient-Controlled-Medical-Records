import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadForm({ onSubmit, onCancel }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/json'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF or JSON file.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    document.getElementById('file-input').value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.type || !formData.date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      file: selectedFile,
      ...formData
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Set max date to today
  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2">Upload File</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-medical-primary/50 transition-colors duration-200">
              <input
                type="file"
                id="file-input"
                accept=".pdf,.json"
                className="hidden"
                onChange={handleFileSelect}
              />
              
              {!selectedFile ? (
                <div 
                  onClick={() => document.getElementById('file-input').click()}
                  className="cursor-pointer"
                >
                  <CloudUpload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-slate-500">PDF and JSON files only</p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="text-medical-primary h-6 w-6 mr-3" />
                      <span className="font-medium text-slate-700">{selectedFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      onClick={removeFile}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Record Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="record-name">Record Name *</Label>
              <Input
                id="record-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Blood Test Results"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="record-type">Record Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange('type', value)}
                required
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="lab-report">Lab Report</SelectItem>
                  <SelectItem value="imaging">Medical Imaging</SelectItem>
                  <SelectItem value="consultation">Consultation Notes</SelectItem>
                  <SelectItem value="vaccination">Vaccination Record</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="record-date">Record Date *</Label>
            <Input
              id="record-date"
              type="date"
              required
              max={maxDate}
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="record-notes">Additional Notes</Label>
            <Textarea
              id="record-notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information about this record..."
              className="mt-2"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="bg-medical-primary hover:bg-medical-primary/90 text-white"
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              Upload Record
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
