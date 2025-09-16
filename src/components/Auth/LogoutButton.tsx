// components/Auth/LogoutButton.tsx
"use client";

import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const onLogout = () => {
    dispatch(logout());
    router.replace("/login");
  };
  return (
    <button onClick={onLogout} className="px-3 py-1 border rounded">
      Logout
    </button>
  );
}
