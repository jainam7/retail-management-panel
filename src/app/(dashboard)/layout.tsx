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
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main Content Area */}
            <main className="lg:ml-64 transition-all duration-300 ease-in-out">
              {/* Mobile top spacing for fixed header */}
              <div className="lg:pt-0">
                {/* Responsive padding and container */}
                <div className="px-2 sm:px-3 lg:px-4 py-4 lg:py-6">
                  <div className="max-w-7xl mx-auto">{children}</div>
                </div>
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
