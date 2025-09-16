// app/dashboard/page.tsx
import Providers from "@/components/Providers";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import InventoryPage from "@/components/Pages/Inventory";

export default function Inventory() {
  return (
    <Providers>
      <ProtectedRoute>
        <div className="min-h-screen p-6 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Inventory</h1>
          <InventoryPage />
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
