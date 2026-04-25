import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getCurrentAdminSession } from "@/lib/server/adminSession";
import { getAdminUsername } from "@/lib/server/siteSettings";

export default async function AdminPage() {
  const session = await getCurrentAdminSession();

  if (!session) {
    return <AdminLoginForm />;
  }

  const adminUsername = await getAdminUsername();
  return <AdminDashboardClient initialUsername={adminUsername} />;
}
