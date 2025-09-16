// app/dashboard/page.tsx
import Providers from "@/components/Providers";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

export default function Deliveries() {
  return (
    <Providers>
      <ProtectedRoute>
        <div className="min-h-screen p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-1">Delivery Management</h1>
          <h3 className="text-1xl mt-2">
            Manage delivery assignments and track orders
          </h3>
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
