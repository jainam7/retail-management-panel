// app/login/page.tsx
import Providers from "@/components/Providers";
import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </Providers>
  );
}
