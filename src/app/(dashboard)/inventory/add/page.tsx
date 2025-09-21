// app/dashboard/page.tsx
import Providers from "@/components/Providers";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AddProductPage from "@/features/inventory/component/AddProduct";
import { Product } from "@/features/inventory/types";
import Link from "next/link";

export default function AddProduct() {
  return (
    <Providers>
      <ProtectedRoute>
        <div className="min-h-screen p-6 bg-gray-50">
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <Link href={{ pathname: "/inventory" }}>
                <button
                  data-slot="button"
                  className="justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md px-3 has-[&gt;svg]:px-2.5 flex items-center gap-2"
                >
                  Back to Inventory
                </button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              Add New Product
            </h1>
            <p className="text-gray-600 mt-2">
              Create a new product with comprehensive details and advanced
              features
            </p>
          </div>
          <AddProductPage />
        </div>
      </ProtectedRoute>
    </Providers>
  );
}
