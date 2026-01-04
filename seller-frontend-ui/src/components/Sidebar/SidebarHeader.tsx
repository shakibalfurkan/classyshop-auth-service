import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAppSelector } from "@/redux/hook";
import { Separator } from "../ui/separator";

export default function SidebarHeader() {
  const { shop } = useAppSelector((state) => state.auth);
  return (
    <section>
      <Link to="/">
        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
          <Avatar className="rounded-lg size-11">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>Shop_Logo</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <h2 className="font-medium">{shop?.name}</h2>
            <h4 className="text-xs text-muted-foreground font-medium">
              {shop?.address}
            </h4>
          </div>
        </div>
      </Link>
      <Separator className="mt-3" />
    </section>
  );
}
