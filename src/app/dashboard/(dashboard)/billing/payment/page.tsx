import { notFound } from "next/navigation";

import PaymentPageClient from "./page.client";

export default async function PaymentPage(
  props: {
    searchParams: Promise<{ plan: string; billing: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const plan = searchParams?.plan;
  const billing = searchParams?.billing;

  if (!plan || !billing) {
    notFound();
  }

  return <PaymentPageClient />;
}
