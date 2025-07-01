import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Pill, 
  TestTube, 
  Stethoscope, 
  Syringe, 
  FileImage
} from "lucide-react";

const getRecordIcon = (type) => {
  const icons = {
    'prescription': Pill,
    'lab-report': TestTube,
    'imaging': FileImage,
    'consultation': Stethoscope,
    'vaccination': Syringe,
    'other': FileText
  };
  return icons[type] || FileText;
};

const formatRecordType = (type) => {
  const types = {
    'prescription': 'Prescription',
    'lab-report': 'Lab Report',
    'imaging': 'Medical Imaging',
    'consultation': 'Consultation Notes',
    'vaccination': 'Vaccination Record',
    'other': 'Other'
  };
  return types[type] || 'Medical Record';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function AccessToggle({ record, onToggleProvider, onToggleResearcher }) {
  const IconComponent = getRecordIcon(record.type);

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center mr-4">
              <IconComponent className="text-medical-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{record.name}</h3>
              <p className="text-sm text-slate-600">
                {formatRecordType(record.type)} • {formatDate(record.date)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-700">Healthcare Providers</span>
              <Switch
                checked={record.sharedWithProviders}
                onCheckedChange={() => onToggleProvider(record.id)}
              />
            </div>
            <p className="text-sm text-slate-600">
              Allow doctors and medical professionals to access this record
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-700">Medical Researchers</span>
              <Switch
                checked={record.sharedWithResearchers}
                onCheckedChange={() => onToggleResearcher(record.id)}
              />
            </div>
            <p className="text-sm text-slate-600">
              Contribute anonymized data to medical research studies
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
