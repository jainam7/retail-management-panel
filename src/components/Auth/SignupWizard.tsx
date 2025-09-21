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
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const formStep1 = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const formStep3 = useForm<Step3Data>({
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
            <Form {...formStep1}>
              <form
                onSubmit={formStep1.handleSubmit(submitStep1)}
                className="space-y-6"
              >
                <FormField
                  control={formStep1.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your full name" />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={formStep1.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={formStep1.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={formStep1.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((s) => !s)}
                            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </Form>
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
                We&rsquo;ve sent a verification code to{" "}
                <strong>{step1Data?.email}</strong>
              </p>
              <Input
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Verify
                </Button>
              </div>
              <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded text-center">
                Demo OTP: 123456
              </p>
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
            <Form {...formStep3}>
              <form
                onSubmit={formStep3.handleSubmit(submitStep3)}
                className="space-y-6"
              >
                <FormField
                  control={formStep3.control}
                  name="businessName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your business name"
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={formStep3.control}
                  name="businessAddress"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter your complete business address"
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={formStep3.control}
                  name="businessPhone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your business phone number"
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={formStep3.control}
                  name="businessCategory"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Business Category</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Business Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Retail",
                              "Wholesale",
                              "Service",
                              "Manufacturing",
                              "Food & Beverage",
                            ].map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Business Profile Image (Optional)
                  </label>
                  <input
                    type="file"
                    {...formStep3.register("file")}
                    accept="image/*,.pdf"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  {previewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="License preview"
                      className="mt-2 h-20 w-20 object-cover rounded border"
                    />
                  )}
                </div>

                <FormField
                  control={formStep3.control}
                  name="acceptTerms"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value} // use checked instead of value
                          onCheckedChange={(checked) => field.onChange(checked)} // map onCheckedChange
                        />
                      </FormControl>
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
                        <FormMessage>{fieldState.error?.message}</FormMessage>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Complete Setup
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="text-center">
            <StepHeader
              title="Welcome to Retailer Panel!"
              subtitle="Account Created Successfully"
            />
            <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
            <p className="text-gray-700 mb-2">
              Your account has been created successfully!
            </p>
            <p className="text-sm text-gray-500">
              Welcome to the retailer panel, {step1Data?.name}
            </p>
            <Button
              onClick={() => router.replace("/dashboard")}
              className="w-full mt-4"
            >
              Go to Dashboard →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
