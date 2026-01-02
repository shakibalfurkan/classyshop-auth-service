import type { ReactNode } from "react";

export default function SidebarMenu({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <>
      <h2 className="mb-2 mt-4 text-sm font-medium text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-1">{children}</div>
    </>
  );
}
