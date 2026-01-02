import { Link } from "react-router";

export default function SidebarMenuItem({
  title,
  to,
  icon,
  isActive,
}: {
  title: string;
  to: string;
  icon: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground ${
        isActive ? "bg-primary/15 hover:bg-primary/12" : "text-foreground/70"
      }`}
    >
      <h4 className={`${isActive ? "text-primary" : ""} text-[22px]`}>
        {icon}
      </h4>
      <h4>{title}</h4>
    </Link>
  );
}
