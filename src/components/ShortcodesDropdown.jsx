// ShortcodesDropdown.jsx

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";

import { Button } from "../components/ui/button";
import { ChevronDown } from "lucide-react";

export default function ShortcodesDropdown({
  shortcuts,
  onSelect,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-none border-l"
        >
          Shortcodes
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 max-h-96 overflow-y-auto"
      >
        {shortcuts.map((item, index) =>
          item.isBold ? (
            <div key={index}>
              {index !== 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
            </div>
          ) : (
            <DropdownMenuItem
              key={index}
              onClick={() => onSelect(item.value)}
            >
              {item.title}
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}