"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Store, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/actions/auth";
import { toast } from "sonner";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Try: admin@storefront.com / admin123");
      } else {
        toast.success("Welcome back!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const result = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (!result.success) {
        setError(result.error ?? "Registration failed");
        return;
      }

      // Auto sign in
      const signInResult = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created but failed to sign in. Please try manually.");
      } else {
        toast.success("Account created successfully!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Store<span className="text-indigo-600">Front</span>
            </span>
          </Link>
          <p className="text-slate-500 mt-2 text-sm">
            {mode === "signin"
              ? "Sign in to your account"
              : "Create your account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {/* Tab Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Demo credentials hint */}
          {mode === "signin" && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-5 text-xs text-indigo-700">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>Admin: <span className="font-mono">admin@storefront.com</span> / <span className="font-mono">admin123</span></p>
              <p>User: <span className="font-mono">user@storefront.com</span> / <span className="font-mono">user123</span></p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
            className="space-y-4"
          >
            {mode === "signup" && (
              <div>
                <Label htmlFor="name" className="text-slate-700 mb-1.5 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-slate-700 mb-1.5 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="pl-9"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-slate-700 mb-1.5 block"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                  value={form.password}
                  onChange={handleChange}
                  className="pl-9 pr-10"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
          >
            ← Back to Store
          </Link>
        </p>
      </div>
    </div>
  );
}
