// components/orders/ClientDate.tsx
import React, { useState, useEffect } from "react";

interface ClientDateProps {
  date: string;
}

export function ClientDate({ date }: ClientDateProps) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    const d = new Date(date);
    setFormatted(
      d.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [date]);

  return <span className="text-gray-600">{formatted || "--"}</span>;
}
