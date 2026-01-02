import Sidebar from "@/components/Sidebar/Sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-[17.5rem_1fr]">
      <Sidebar />
      <main className="p-4 overflow-y-auto">
        <Outlet />
      </main>
    </section>
  );
}
