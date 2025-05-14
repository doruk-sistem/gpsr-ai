"use client";

import dynamic from "next/dynamic";

const RequestPageClient = dynamic(() => import("./page.client"), {
  ssr: false,
});

export default function RequestPage() {
  return <RequestPageClient />;
}
