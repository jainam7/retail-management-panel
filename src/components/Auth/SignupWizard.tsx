// components/Auth/SignupWizard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import {
  signupComplete,
  sendOtpRequest,
  sendOtpSuccess,
} from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

type Step1Data = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Step3Data = {
  businessName: string;
  file?: FileList;
  acceptTerms: boolean;
};

export default function SignupWizard() {
  const [step, setStep] = useState<number>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // ---- Step 1 form
  const {
    register: r1,
    handleSubmit: h1,
    formState: fs1,
  } = useForm<Step1Data>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // ---- Step 3 form
  const { register: r3, handleSubmit: h3 } = useForm<Step3Data>({
    defaultValues: { businessName: "", acceptTerms: false },
  });

  // Mock: demo OTP
  const DEMO_OTP = "123456";

  const submitStep1 = (data: Step1Data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setStep1Data(data);
    // simulate send OTP
    dispatch(sendOtpRequest());
    setTimeout(() => {
      setOtpSent(true);
      dispatch(sendOtpSuccess());
      setStep(2);
    }, 700);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.trim() === DEMO_OTP) {
      setStep(3);
    } else {
      alert("Invalid OTP. Use 123456 for demo.");
    }
  };

  const submitStep3 = (data: Step3Data) => {
    // process file preview
    if (data.file && data.file.length > 0) {
      const file = data.file[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    // Create mock token/user and dispatch signupComplete -> logs user in
    const token = "signup-token-xyz";
    const user = {
      name: step1Data!.name,
      email: step1Data!.email,
      businessName: data.businessName,
    };
    // remember is true by default for signups in this demo
    dispatch(signupComplete({ token, user, remember: true }));
    setStep(4);
    // After small delay redirect to dashboard
    setTimeout(() => {
      router.replace("/dashboard");
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>

      {step === 1 && (
        <form onSubmit={h1(submitStep1)} className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Full name</label>
            <input
              {...r1("name", { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Email</label>
            <input
              {...r1("email", { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Password</label>
            <div className="flex items-center gap-2">
              <input
                {...r1("password", { required: true, minLength: 6 })}
                type={showPassword ? "text" : "password"}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="px-3 py-2 border rounded"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1">Confirm Password</label>
            <input
              {...r1("confirmPassword", { required: true })}
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-between">
            <div />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Send OTP
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div>
          <p className="mb-3">
            We sent an OTP to <strong>{step1Data?.email}</strong>. Use{" "}
            <code>123456</code> in demo.
          </p>
          <form onSubmit={verifyOtp} className="flex gap-2">
            <input
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              className="p-2 border rounded flex-1"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Verify
            </button>
          </form>
          <div className="mt-3">
            <button
              onClick={() => {
                setStep(1);
              }}
              className="text-sm text-gray-600"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={h3(submitStep3)} className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Business Name</label>
            <input
              {...r3("businessName", { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">
              Upload Business Document (optional)
            </label>
            <input type="file" {...r3("file")} className="w-full" />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="mt-2 h-24 object-contain"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input {...r3("acceptTerms", { required: true })} type="checkbox" />
            <label className="text-sm">I accept terms & conditions</label>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Finish & Create Account
            </button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Account created</h3>
          <p>You are being redirected to your dashboard…</p>
        </div>
      )}
    </div>
  );
}
