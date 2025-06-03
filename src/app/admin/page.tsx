import { currentUser } from "@clerk/nextjs/server"; //tambah server
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Navbar from "@/components/navbar-01/navbar-01";

export default async function AdminDashboard() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user.firstName}!</p>
      <div className="mt-4">
        <Link href="/admin/santri" className="text-blue-600 hover:underline">
          Manage Santri
        </Link>
        <br />
        <Link href="/admin/berita" className="text-blue-600 hover:underline">
          Manage Berita
        </Link>
      </div>
    </div>
  );
}
