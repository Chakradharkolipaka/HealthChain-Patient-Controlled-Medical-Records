import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm({ onLogin, onSignup, onBackToHome }) {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '', confirm: '' });
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Missing credentials",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Replace with Internet Identity or custom Auth Canister
    onLogin(loginData);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (!signupData.username || !signupData.password || !signupData.confirm) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password !== signupData.confirm) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Replace with Internet Identity or custom Auth Canister
    onSignup({
      username: signupData.username,
      password: signupData.password
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-bold text-slate-900">HealthChain</h2>
        </div>
        <p className="text-slate-600">Access your secure medical records</p>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  type="text"
                  required
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full bg-medical-primary hover:bg-medical-primary/90 text-white">
                Continue
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  required
                  value={signupData.username}
                  onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Choose a username"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create a password"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  required
                  value={signupData.confirm}
                  onChange={(e) => setSignupData(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="Confirm your password"
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full bg-medical-primary hover:bg-medical-primary/90 text-white">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button
            onClick={onBackToHome}
            variant="link"
            className="text-medical-primary hover:text-medical-primary/80"
          >
            ← Back to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
