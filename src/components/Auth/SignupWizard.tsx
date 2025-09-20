// components/Auth/SignupWizard.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/store/hooks";
import {
  signupComplete,
  sendOtpRequest,
  sendOtpSuccess,
} from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ---------------- Types ----------------
type Step1Data = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Step3Data = {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessCategory: string;
  file?: FileList;
  acceptTerms: boolean;
};

// ---------------- Reusable Inputs ----------------
const FormInput = ({
  label,
  type = "text",
  placeholder,
  error,
  valid,
  register,
  showToggle,
  showValue,
  onToggle,
}: {
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  valid?: boolean;
  register: any;
  showToggle?: boolean;
  showValue?: boolean;
  onToggle?: () => void;
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          {...register}
          type={showToggle ? (showValue ? "text" : "password") : type}
          placeholder={placeholder}
          className={`w-full p-3 border-2 rounded-lg transition-colors ${
            error
              ? "border-red-500 focus:border-red-500"
              : valid
              ? "border-green-500 focus:border-green-500"
              : "border-gray-300 focus:border-blue-500"
          } focus:outline-none`}
        />
        {/* Error Icon */}
        {error && (
          <AlertCircle
            className="absolute right-12 top-3.5 text-red-500"
            size={18}
          />
        )}
        {/* Success Icon */}
        {!error && valid && (
          <CheckCircle
            className="absolute right-12 top-3.5 text-green-500"
            size={18}
          />
        )}
        {/* Password Toggle */}
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
          >
            {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {/* Error Message */}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

const FormTextArea = ({
  label,
  placeholder,
  error,
  valid,
  register,
}: {
  label: string;
  placeholder: string;
  error?: string;
  valid?: boolean;
  register: any;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...register}
      placeholder={placeholder}
      rows={3}
      className={`w-full p-3 border-2 rounded-lg transition-colors resize-none ${
        error
          ? "border-red-500 focus:border-red-500"
          : valid
          ? "border-green-500 focus:border-green-500"
          : "border-gray-300 focus:border-blue-500"
      } focus:outline-none`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

const FormSelect = ({
  label,
  options,
  error,
  valid,
  register,
}: {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  valid?: boolean;
  register: any;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      {...register}
      className={`w-full p-3 border-2 rounded-lg transition-colors ${
        error
          ? "border-red-500 focus:border-red-500"
          : valid
          ? "border-green-500 focus:border-green-500"
          : "border-gray-300 focus:border-blue-500"
      } focus:outline-none`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

// ---------------- Main Component ----------------
export default function SignupWizard() {
  const [step, setStep] = useState<number>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // ---------- Validation ----------
  const step1Schema = z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email format"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const step3Schema = z.object({
    businessName: z.string().min(2, "Business name is required"),
    businessAddress: z.string().min(10, "Please enter a complete address"),
    businessPhone: z.string().min(10, "Please enter a valid phone number"),
    businessCategory: z.string().min(1, "Please select a category"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  });

  const {
    register: r1,
    handleSubmit: h1,
    formState: { errors: e1, touchedFields: t1 },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const {
    register: r3,
    handleSubmit: h3,
    formState: { errors: e3, touchedFields: t3 },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessPhone: "",
      businessCategory: "",
      acceptTerms: false,
    },
  });

  const DEMO_OTP = "123456";

  // ---------- Handlers ----------
  const submitStep1 = (data: Step1Data) => {
    setStep1Data(data);
    dispatch(sendOtpRequest());
    setTimeout(() => {
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
    if (data.file && data.file.length > 0) {
      setPreviewUrl(URL.createObjectURL(data.file[0]));
    }
    const token = "signup-token-xyz";
    const user = {
      name: step1Data!.name,
      email: step1Data!.email,
      businessName: data.businessName,
      businessCategory: data.businessCategory,
      businessPhone: data.businessPhone,
      businessAddress: data.businessAddress,
    };
    dispatch(signupComplete({ token, user, remember: true }));
    setStep(4);
  };

  // ---------- Step Header ----------
  const StepHeader = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle: string;
  }) => (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900">Retailer Panel</h1>
      <p className="text-gray-600">{subtitle}</p>
      <div className="mt-6 bg-gray-200 rounded-full h-2">
        <div
          className="bg-black h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">Step {step} of 4</p>
      <h2 className="text-xl font-semibold mt-4">{title}</h2>
    </div>
  );

  // ---------- UI ----------
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <StepHeader
              title="Create Account"
              subtitle="Enter your basic information"
            />
            <form onSubmit={h1(submitStep1)} className="space-y-6">
              <FormInput
                label="Full Name"
                placeholder="Enter your full name"
                register={r1("name")}
                error={e1.name?.message}
                valid={t1.name && !e1.name}
              />
              <FormInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                register={r1("email")}
                error={e1.email?.message}
                valid={t1.email && !e1.email}
              />
              <FormInput
                label="Password"
                placeholder="Create a password"
                register={r1("password")}
                error={e1.password?.message}
                valid={t1.password && !e1.password}
                showToggle
                showValue={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
              />
              <FormInput
                label="Confirm Password"
                placeholder="Confirm your password"
                register={r1("confirmPassword")}
                error={e1.confirmPassword?.message}
                valid={t1.confirmPassword && !e1.confirmPassword}
                showToggle
                showValue={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((s) => !s)}
              />
              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <StepHeader
              title="Verify Your Email"
              subtitle="Verify your email address"
            />
            <form onSubmit={verifyOtp} className="space-y-6">
              <p className="text-sm text-gray-600 text-center">
                We've sent a verification code to{" "}
                <strong>{step1Data?.email}</strong>
              </p>
              <FormInput
                label="Verification Code"
                placeholder="Enter 6-digit code"
                register={{
                  value: otpValue,
                  onChange: (e: any) => setOtpValue(e.target.value),
                }}
                error={otpValue && otpValue !== DEMO_OTP ? "Invalid OTP" : ""}
                valid={otpValue === DEMO_OTP}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Verify
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  Demo OTP: 123456
                </p>
              </div>
            </form>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <StepHeader
              title="Business Information"
              subtitle="Complete your business details"
            />
            <form onSubmit={h3(submitStep3)} className="space-y-6">
              <FormInput
                label="Business Name"
                placeholder="Enter your business name"
                register={r3("businessName")}
                error={e3.businessName?.message}
                valid={t3.businessName && !e3.businessName}
              />
              <FormTextArea
                label="Business Address"
                placeholder="Enter your complete business address"
                register={r3("businessAddress")}
                error={e3.businessAddress?.message}
                valid={t3.businessAddress && !e3.businessAddress}
              />
              <FormInput
                label="Business Phone"
                placeholder="Enter your business phone number"
                register={r3("businessPhone")}
                error={e3.businessPhone?.message}
                valid={t3.businessPhone && !e3.businessPhone}
              />
              <FormSelect
                label="Business Category"
                options={[
                  { value: "", label: "Select Business Category" },
                  { value: "Retail", label: "Retail" },
                  { value: "Wholesale", label: "Wholesale" },
                  { value: "Service", label: "Service" },
                  { value: "Manufacturing", label: "Manufacturing" },
                  { value: "Food & Beverage", label: "Food & Beverage" },
                ]}
                register={r3("businessCategory")}
                error={e3.businessCategory?.message}
                valid={t3.businessCategory && !e3.businessCategory}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Business License (Optional)
                </label>
                <input
                  type="file"
                  {...r3("file")}
                  accept="image/*,.pdf"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="License preview"
                    className="mt-2 h-20 w-20 object-cover rounded border"
                  />
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...r3("acceptTerms")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                  {e3.acceptTerms && (
                    <p className="text-sm text-red-600 mt-1">
                      {e3.acceptTerms.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Complete Setup
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="text-center">
            <StepHeader
              title="Welcome to Retailer Panel!"
              subtitle="Account Created Successfully"
            />
            <div className="mb-6">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
              <p className="text-gray-700 mb-2">
                Your account has been created successfully!
              </p>
              <p className="text-sm text-gray-500">
                Welcome to the retailer panel, {step1Data?.name}
              </p>
            </div>
            <button
              onClick={() => router.replace("/dashboard")}
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
