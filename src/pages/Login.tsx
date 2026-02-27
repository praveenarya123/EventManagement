import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, AlertCircle } from "lucide-react";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("Please enter both User ID and Password.");
      return;
    }

    const success = await login(userId, password);
    if (success) {
      // After login, redirect based on role from context
      // Wait for AuthContext to update
      setTimeout(() => {
        const stored = sessionStorage.getItem("ems_user");
        if (stored) {
          const { role } = JSON.parse(stored);
          if (role === "admin") navigate("/admin");
          else if (role === "vendor") navigate("/vendor");
          else navigate("/user");
        }
      }, 0);
    } else {
      setError("Invalid User ID or Password.");
    }
  };

  const handleCancel = () => {
    setUserId("");
    setPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="gradient-primary rounded-xl p-6 text-center shadow-elevated">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CalendarDays className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-2xl font-heading font-bold text-primary-foreground">
              Event Management System
            </h1>
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Manage events, vendors, and guests seamlessly
          </p>
        </div>

        <Card className="shadow-elevated border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="admin / vendor / user"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Login
                </Button>
              </div>
            </form>


            <div className="mt-4 text-center">
              <span>Don't have an account? </span>
              <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
