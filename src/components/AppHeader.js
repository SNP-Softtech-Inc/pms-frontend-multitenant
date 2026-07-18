import {
  Bell,
  Menu,
  Search,
  Moon,
  Sun,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";

export default function AppHeader({
  setSidebarOpen,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu />
        </Button>

        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-3 text-muted-foreground"
          />

          <Input
            placeholder="Search..."
            className="w-80 pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
        >
          <Moon size={18} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
        >
          <Bell size={18} />
        </Button>

        <Avatar>
          <AvatarImage src="" />

          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}