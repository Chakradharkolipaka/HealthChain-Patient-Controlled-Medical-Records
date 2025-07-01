import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Pill, 
  TestTube, 
  Stethoscope, 
  Syringe, 
  FileImage,
  Share2,
  Beaker
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

export default function RecordCard({ record, onShareProvider, onShareResearcher }) {
  const IconComponent = getRecordIcon(record.type);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-medical-primary/10 rounded-lg flex items-center justify-center mr-4">
              <IconComponent className="text-medical-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{record.name}</h3>
              <p className="text-sm text-slate-600">
                {formatRecordType(record.type)} • {formatDate(record.date)} • {record.size}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => onShareProvider(record.id)}
              className="bg-medical-secondary hover:bg-medical-secondary/90 text-white"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share with Provider
            </Button>
            <Button
              onClick={() => onShareResearcher(record.id)}
              className="bg-medical-accent hover:bg-medical-accent/90 text-white"
              size="sm"
            >
              <Beaker className="h-4 w-4 mr-2" />
              Share with Researcher
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
