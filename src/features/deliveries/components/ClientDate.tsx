import React, { useState } from "react";

export function ClientDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState("");

  React.useEffect(() => {
    const d = new Date(date);
    setFormatted(
      `${d.toLocaleDateString()}, ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  }, [date]);

  if (!formatted) return <span className="text-gray-600">--</span>;
  return <span className="text-gray-600">{formatted}</span>;
}
