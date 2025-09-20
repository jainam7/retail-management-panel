import Providers from "@/components/Providers";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Setting from "@/components/Pages/Settings";

export default function SettingsPage() {
  return (
    <Providers>
      <ProtectedRoute>
        <div>
          <Setting />
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
