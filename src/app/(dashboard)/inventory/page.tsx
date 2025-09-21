// app/dashboard/page.tsx
import Providers from "@/components/Providers";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import InventoryPage from "@/components/Pages/Inventory";

export default function Inventory() {
  return (
    <Providers>
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <InventoryPage />
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
