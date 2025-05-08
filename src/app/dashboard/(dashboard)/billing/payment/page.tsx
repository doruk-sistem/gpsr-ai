import { notFound } from "next/navigation";

import PaymentPageClient from "./page.client";

export default async function PaymentPage(props: {
  searchParams: Promise<{ productId: string; billing: string }>;
}) {
  const searchParams = await props.searchParams;
  const productId = searchParams?.productId;
  const billing = searchParams?.billing;

  if (!productId || !billing) {
    notFound();
  }

  return <PaymentPageClient />;
}
