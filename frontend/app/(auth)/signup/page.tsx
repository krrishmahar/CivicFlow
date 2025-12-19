"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthLayout from "@/components/layout/AuthLayout";
import { useSignupMutation } from "@/api/authApi";

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["COMPLAINANT", "VOLUNTEER", "ADMIN"], {
      message: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[A-Z]/, text: "One uppercase letter" },
  { regex: /[a-z]/, text: "One lowercase letter" },
  { regex: /[0-9]/, text: "One number" },
];

const PasswordRequirements = ({ password }: { password: string }) => {
  if (!password) return null;

  return (
    <div className="grid grid-cols-2 gap-2 mt-3">
      {passwordRequirements.map((req, i) => {
        const isMet = req.regex.test(password);
        return (
          <div
            key={i}
            className={`flex items-center gap-2 text-xs transition-colors ${
              isMet ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Check
              className={`h-3 w-3 ${isMet ? "opacity-100" : "opacity-30"}`}
            />
            {req.text}
          </div>
        );
      })}
    </div>
  );
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await signup({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      }).unwrap();

      toast.success("Account created!", {
        description:
          "Welcome to CivicFlow. Please check your email to verify your account.",
      });

      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      const errorMessage = error?.data?.error?.message || 
                          error?.data?.error || 
                          "Something went wrong. Please try again.";
      
      toast.error("Registration failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join the community and start making a difference"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            autoComplete="name"
            disabled={isLoading}
            {...register("fullName")}
            aria-invalid={errors.fullName ? "true" : "false"}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            disabled={isLoading}
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            onValueChange={(value) =>
              setValue(
                "role",
                value as "COMPLAINANT" | "VOLUNTEER" | "ADMIN",
                {
                  shouldValidate: true,
                }
              )
            }
            disabled={isLoading}
          >
            <SelectTrigger
              id="role"
              aria-invalid={errors.role ? "true" : "false"}
              aria-describedby={errors.role ? "role-error" : undefined}
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COMPLAINANT">Citizen</SelectItem>
              <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
              <SelectItem value="ADMIN">Administrator</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p id="role-error" className="text-sm text-destructive" role="alert">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className="pr-12"
              disabled={isLoading}
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={
                errors.password ? "password-error" : "password-requirements"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isLoading}
              tabIndex={isLoading ? -1 : 0}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}

          <div id="password-requirements" aria-live="polite">
            <PasswordRequirements password={password} />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              className="pr-12"
              disabled={isLoading}
              {...register("confirmPassword")}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              disabled={isLoading}
              tabIndex={isLoading ? -1 : 0}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="confirmPassword-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full h-12" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="text-primary underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            tabIndex={isLoading ? -1 : 0}
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-primary underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            tabIndex={isLoading ? -1 : 0}
          >
            Privacy Policy
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}