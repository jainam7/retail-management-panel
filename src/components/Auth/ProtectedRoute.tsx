"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (!auth) {
      router.replace("/login"); // Force redirect if not logged in
    }
  }, [router]);

  return <>{children}</>;
}
