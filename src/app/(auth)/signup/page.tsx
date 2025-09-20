// app/signup/page.tsx
import Providers from "@/components/Providers";
import SignupWizard from "@/components/Auth/SignupWizard";

export default function SignupPage() {
  return (
    <Providers>
      <div className="max-w-md w-full space-y-8">
        <SignupWizard />
      </div>
    </Providers>
  );
}
