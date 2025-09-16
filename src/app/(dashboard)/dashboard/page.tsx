// app/dashboard/page.tsx
import Providers from "@/components/Providers";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Dashboard from "@/components/Pages/Dashboard";

export default function DashboardPage() {
  return (
    <Providers>
      <ProtectedRoute>
        <div className="min-h-screen p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <Dashboard />
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
