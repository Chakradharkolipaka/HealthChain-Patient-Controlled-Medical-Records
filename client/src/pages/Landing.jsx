import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Network, ShieldCheck, Lock, Users, History, Award, ArrowRight, Info } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/Footer";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-medical-gradient min-h-screen flex items-center">
        <div className="absolute inset-0 bg-white/75"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900">HealthChain</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Badge className="bg-medical-primary/10 text-medical-primary hover:bg-medical-primary/20">
                <Shield className="mr-2 h-4 w-4" />
                Secure
              </Badge>
              <Badge className="bg-medical-secondary/10 text-medical-secondary hover:bg-medical-secondary/20">
                <Network className="mr-2 h-4 w-4" />
                Decentralized
              </Badge>
              <Badge className="bg-medical-accent/10 text-medical-accent hover:bg-medical-accent/20">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Patient-Controlled
              </Badge>
            </div>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
              Take control of your medical records with blockchain-powered security. 
              Upload, manage, and share your health data with complete privacy and ownership.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setLocation("/login")}
                size="lg"
                className="bg-medical-primary hover:bg-medical-primary/90 text-white px-8 py-4 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => setLocation("/privacy")}
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-2"
              >
                <Info className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose HealthChain?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built on Internet Computer Protocol for maximum security and decentralization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-medical-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="text-medical-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  End-to-End Encryption
                </h3>
                <p className="text-slate-600">
                  Your medical data is encrypted at rest and in transit, ensuring complete privacy and security.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-medical-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-medical-secondary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Patient-Controlled Access
                </h3>
                <p className="text-slate-600">
                  You decide who can access your medical records and can revoke access at any time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-medical-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="text-medical-accent h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Immutable Audit Trail
                </h3>
                <p className="text-slate-600">
                  Every access and modification is permanently recorded on the blockchain for transparency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="py-16 bg-medical-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="text-medical-primary h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            HIPAA Compliant & Secure
          </h3>
          <p className="text-lg text-slate-600">
            HealthChain is designed to meet HIPAA compliance requirements and follows 
            industry best practices for medical data security and privacy protection.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
