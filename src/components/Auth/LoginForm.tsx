// components/Auth/LoginForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginRequest } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "retailer@example.com",
      password: "RetailerPass123",
      remember: true,
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [auth.isAuthenticated, router]);

  const onSubmit = (data: FormData) => {
    dispatch(
      loginRequest({
        email: data.email,
        password: data.password,
        remember: !!data.remember,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Purple Header */}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-1 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retailer Panel
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-600 mt-2">
              Sign in to your retailer account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                {...register("remember")}
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {auth.error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
                {auth.error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={auth.loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {auth.loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                Sign up
              </a>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md border">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Demo Credentials:
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Email: retailer@example.com</p>
                <p>Password: RetailerPass123</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
