import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { registerUser } from '@/api/auth'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerUser({ email, username, password });
      console.log("User registered successfully:", result);
      navigate("/login"); 
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col justify-center items-center px-4">
      <Link to="/" className="text-3xl font-bold text-indigo-600 mb-8"> 
        Musijam
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Up for Musijam</CardTitle>
          <CardDescription className="text-center">Create your account to start jamming</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="coolmusician123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center w-full text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline"> 
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
