// components/Auth/LoginForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginRequest } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, "Password must be at least 6 chars"),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "demo@demo.com",
      password: "password",
      remember: true,
    },
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <label className="block mb-2 text-sm font-medium">Email</label>
      <input
        {...register("email")}
        className="w-full p-2 border rounded mb-3"
      />

      <label className="block mb-2 text-sm font-medium">Password</label>
      <div className="flex items-center gap-2">
        <input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          className="flex-1 p-2 border rounded mb-3"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="px-3 py-2 border rounded whitespace-nowrap"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          id="remember"
          type="checkbox"
          {...register("remember")}
          defaultChecked
        />
        <label htmlFor="remember" className="text-sm">
          Remember me
        </label>
      </div>

      {auth.error && (
        <div className="text-sm text-red-600 mb-2">{auth.error}</div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded disabled:opacity-70"
        disabled={auth.loading}
      >
        {auth.loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="mt-3 text-sm">
        <span>Not registered? </span>
        <a href="/signup" className="text-blue-600">
          Create account
        </a>
      </div>
    </form>
  );
}
