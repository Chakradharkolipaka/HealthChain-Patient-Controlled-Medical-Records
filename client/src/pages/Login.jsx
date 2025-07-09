import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/icpAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const handleInternetIdentityLogin = async () => {
    try {
      await login();
      toast({
        title: "Login successful!",
        description: "Welcome to HealthChain on Internet Computer.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBackToHome = () => {
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-slate-900">
            Welcome to HealthChain
          </CardTitle>
          <p className="text-slate-600 mt-2">
            Secure, decentralized medical records on Internet Computer
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleInternetIdentityLogin}
            className="w-full bg-medical-primary hover:bg-medical-primary/90 text-white"
            size="lg"
          >
            Login with Internet Identity
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-slate-600">
              New to Internet Computer?{" "}
              <a 
                href="https://identity.ic0.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-medical-primary hover:underline"
              >
                Create an Internet Identity
              </a>
            </p>
          </div>

          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
