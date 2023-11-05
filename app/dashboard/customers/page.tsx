import { fetchFilteredCustomers } from "@/app/lib/data";
import CustomersTable from "@/app/ui/customers/table";
import { Metadata } from "next";
import { validateSession } from "@/app/lib/sessions/validate-session";
import SessionExpired from "@/app/ui/session-expired";
import { auth } from "@/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  const isSessionValid = await validateSession(headers(), session);
  if (!isSessionValid) {
    return (
      <main>
        <SessionExpired />
      </main>
    );
  }

  const query = searchParams?.query || "";

  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
