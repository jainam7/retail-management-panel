import Providers from "@/components/Providers";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import OrdersPage from "@/components/Pages/OrdersPage";

export default function Orders() {
  return (
    <Providers>
      <ProtectedRoute>
        <div>
          <OrdersPage />
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
