import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminData, isJyxdiAdmin, isStoreConfigured } from "@/lib/jyxdiStore";
import AdminGate from "./AdminGate";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const Notice = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
    <h1 className="jx-serif text-3xl">{title}</h1>
    <div className="mt-4 text-[var(--jx-muted)]">{children}</div>
  </div>
);

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <AdminGate mode="signin" />;
  if (!isJyxdiAdmin(session)) return <AdminGate mode="denied" email={session.user?.email || ""} />;

  if (!isStoreConfigured()) {
    return (
      <Notice title="Almost ready">
        The store&apos;s Google Sheet isn&apos;t connected yet, so there&apos;s nowhere to save changes. Set{" "}
        <code>JYXDI_SHEET_ID</code> in Vercel and share the sheet with the site&apos;s service account.
      </Notice>
    );
  }

  let data: Awaited<ReturnType<typeof getAdminData>>;
  try {
    data = await getAdminData();
  } catch (error: any) {
    console.error("Jyxdi admin load error:", error.message);
    return (
      <Notice title="Can't reach the store sheet">
        Check that the Google Sheet is shared with the site&apos;s service account as an Editor, then reload.
      </Notice>
    );
  }

  return <AdminPanel email={session.user?.email || ""} initialProducts={data.products} initialSettings={data.settings} />;
}
