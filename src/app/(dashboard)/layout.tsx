// app/(dashboard)/layout.tsx
import "../globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Retailer Panel",
  description: "Retailer Management System",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <main className="ml-64 p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
