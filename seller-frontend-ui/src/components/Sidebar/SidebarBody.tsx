import { useLocation } from "react-router";
import SidebarMenu from "./SidebarMenu";
import SidebarMenuItem from "./SidebarMenuItem";
import { RiDashboardFill } from "react-icons/ri";
import { GoListOrdered } from "react-icons/go";
import { IoMdWallet } from "react-icons/io";
import { AiOutlinePlusSquare } from "react-icons/ai";
import {
  LuPackageSearch,
  LuCalendarPlus,
  LuMail,
  LuSettings,
  LuCalendarDays,
  LuBellRing,
  LuTicketSlash,
} from "react-icons/lu";

export default function SidebarBody() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <section className="flex-1 overflow-y-auto sidebar-scroll">
      <SidebarMenuItem
        title="Dashboard"
        to="/dashboard"
        icon={<RiDashboardFill />}
        isActive={pathname === "/dashboard"}
      />
      <div className="mt-6 space-y-6">
        {/*Main Menu */}
        <SidebarMenu title="Main">
          {/* orders */}
          <SidebarMenuItem
            title="Orders"
            to="/dashboard/orders"
            icon={<GoListOrdered />}
            isActive={pathname === "/dashboard/orders"}
          />
          {/* payments */}
          <SidebarMenuItem
            title="Payments"
            to="/dashboard/payments"
            icon={<IoMdWallet />}
            isActive={pathname === "/dashboard/payments"}
          />
        </SidebarMenu>

        {/* Products*/}
        <SidebarMenu title="Products">
          {/* Create Product */}
          <SidebarMenuItem
            title="Create Product"
            to="/dashboard/create-product"
            icon={<AiOutlinePlusSquare />}
            isActive={pathname === "/dashboard/create-product"}
          />

          {/* All Products */}
          <SidebarMenuItem
            title="All Products"
            to="/dashboard/all-products"
            icon={<LuPackageSearch />}
            isActive={pathname === "/dashboard/all-products"}
          />
        </SidebarMenu>

        {/* Events menu */}
        <SidebarMenu title="Events">
          {/* Create Event */}
          <SidebarMenuItem
            title="Create Event"
            to="/dashboard/create-event"
            icon={<LuCalendarPlus />}
            isActive={pathname === "/dashboard/create-event"}
          />
          {/* All Events */}
          <SidebarMenuItem
            title="All Events"
            to="/dashboard/all-events"
            icon={<LuCalendarDays />}
            isActive={pathname === "/dashboard/all-events"}
          />
        </SidebarMenu>
        {/* Controllers menu */}
        <SidebarMenu title="Controllers">
          {/* inbox */}
          <SidebarMenuItem
            title="Inbox"
            to="/dashboard/inbox"
            icon={<LuMail />}
            isActive={pathname === "/dashboard/inbox"}
          />
          {/* settings */}
          <SidebarMenuItem
            title="Settings"
            to="/dashboard/settings"
            icon={<LuSettings />}
            isActive={pathname === "/dashboard/settings"}
          />
          {/* notifications */}
          <SidebarMenuItem
            title="Notifications"
            to="/dashboard/notifications"
            icon={<LuBellRing />}
            isActive={pathname === "/dashboard/notifications"}
          />
        </SidebarMenu>

        {/* Extras */}
        <SidebarMenu title="Extras">
          {/* coupon codes */}
          <SidebarMenuItem
            title="Coupon Codes"
            to="/dashboard/coupon-codes"
            icon={<LuTicketSlash />}
            isActive={pathname === "/dashboard/coupon-codes"}
          />
        </SidebarMenu>
      </div>
    </section>
  );
}
