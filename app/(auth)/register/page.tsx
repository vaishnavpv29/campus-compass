"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle, GraduationCap as CapIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Please enter a valid email"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(["student", "insider"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: "student" as const,
    label: "Student / Explorer",
    description: "Browse colleges, read reviews, take the quiz, and book insider sessions.",
    icon: Users,
    color: "border-primary bg-primary/5",
    selectedColor: "border-primary bg-primary/10 ring-2 ring-primary/30",
  },
  {
    value: "insider" as const,
    label: "College Insider",
    description: "Current student or alumni? Share your experience and help other students.",
    icon: CapIcon,
    color: "border-amber bg-amber/5",
    selectedColor: "border-amber bg-amber/10 ring-2 ring-amber/30",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Registration failed");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-glow">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-2xl">
            Campus<span className="text-amber">Compass</span>
          </span>
        </Link>

        <div className="card p-8">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-1">Create your account</h2>
          <p className="text-muted-foreground text-sm mb-6">Join 1.2L+ students making smarter college decisions</p>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-foreground mb-3 block">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("role", opt.value)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                    selectedRole === opt.value ? opt.selectedColor : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <opt.icon className={cn("w-5 h-5 mb-2", selectedRole === opt.value ? (opt.value === "student" ? "text-primary" : "text-amber") : "text-muted-foreground")} />
                  <div className="font-semibold text-sm text-foreground">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{opt.description}</div>
                  {selectedRole === opt.value && (
                    <CheckCircle className={cn("absolute top-2 right-2 w-4 h-4", opt.value === "student" ? "text-primary" : "text-amber")} />
                  )}
                </button>
              ))}
            </div>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block" htmlFor="reg-name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Arjun Sharma"
                  {...register("name")}
                  className={cn("input-field pl-10", errors.name && "border-red-500")}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block" htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={cn("input-field pl-10", errors.email && "border-red-500")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 chars with uppercase & number"
                  {...register("password")}
                  className={cn("input-field pl-10 pr-10", errors.password && "border-red-500")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block" htmlFor="reg-confirm">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  {...register("confirmPassword")}
                  className={cn("input-field pl-10", errors.confirmPassword && "border-red-500")}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              id="register-submit"
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
