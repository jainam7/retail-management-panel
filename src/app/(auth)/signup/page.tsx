// app/signup/page.tsx
import Providers from "@/components/Providers";
import SignupWizard from "@/components/Auth/SignupWizard";

export default function SignupPage() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <SignupWizard />
      </div>
    </Providers>
  );
}
