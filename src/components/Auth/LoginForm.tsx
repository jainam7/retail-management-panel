"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginRequest } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

// shadcn/ui components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "retailer@example.com",
      password: "RetailerPass123",
      remember: true,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (auth.isAuthenticated && window.location.pathname === "/login") {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your retailer account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pr-10"
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me */}
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-gray-700">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Error Message */}
            {auth.error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
                {auth.error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={auth.loading}>
              {auth.loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
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
        </Form>
      </div>
    </div>
  );
}
