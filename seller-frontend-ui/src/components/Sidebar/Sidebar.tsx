import SidebarBody from "./SidebarBody";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
  return (
    <aside
      className="
        sticky top-0 h-screen border-r p-4 hidden 
        lg:flex flex-col space-y-4
      "
    >
      {/* header */}
      <SidebarHeader />

      {/* body */}
      <SidebarBody />

      {/* footer */}
      <div>footer</div>
    </aside>
  );
}
