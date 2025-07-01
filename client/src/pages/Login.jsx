import { useLocation } from "wouter";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      toast({
        title: "Login successful!",
        description: "Welcome back to HealthChain.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (userData) => {
    try {
      await signup(userData);
      toast({
        title: "Account created successfully!",
        description: "Welcome to HealthChain.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again with different credentials.",
        variant: "destructive"
      });
    }
  };

  const handleBackToHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm 
        onLogin={handleLogin}
        onSignup={handleSignup}
        onBackToHome={handleBackToHome}
      />
    </div>
  );
}
