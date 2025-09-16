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
      <body className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
