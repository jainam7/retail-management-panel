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
        <div className="flex">
          <Sidebar />
          <Providers>
            <main className="flex-1 min-h-screen bg-gray-50 p-4">
              {children}
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
