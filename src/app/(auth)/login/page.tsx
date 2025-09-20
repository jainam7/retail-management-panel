// app/login/page.tsx
import Providers from "@/components/Providers";
import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
  return (
    <Providers>
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
      </div>
    </Providers>
  );
}
