// app/(auth)/layout.tsx
import "../globals.css";

export const metadata = {
  title: "Retailer Panel - Auth",
  description: "Login and Signup pages",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-8">{children}</div>
      </body>
    </html>
  );
}
