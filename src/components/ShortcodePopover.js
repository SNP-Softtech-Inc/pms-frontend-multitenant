

// import React, { useState, useMemo, useEffect } from "react";
// import { Search, X } from "lucide-react";

// const ShortcodePopover = ({
//   open,
//   anchorEl,
//   onClose,
//   shortcuts,
//   onSelectShortcut,
//   title = "Add Shortcode",
//   showSearch = true,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [position, setPosition] = useState({ top: 0, left: 0 });

//   // Reset search when popover closes
//   useEffect(() => {
//     if (!open) {
//       setSearchTerm("");
//     }
//   }, [open]);

//   // Calculate position when popover opens or anchor changes
//   useEffect(() => {
//     if (open && anchorEl) {
//       const rect = anchorEl.getBoundingClientRect();
//       setPosition({
//         top: rect.bottom + window.scrollY + 4,
//         left: rect.left + window.scrollX,
//       });
//     }
//   }, [open, anchorEl]);

//   const filteredShortcuts = useMemo(() => {
//     if (!searchTerm.trim()) return shortcuts;
    
//     return shortcuts.filter(shortcut => 
//       shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (shortcut.value && shortcut.value.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [shortcuts, searchTerm]);

//   const handleSelectShortcut = (shortcutValue) => {
//     if (shortcutValue && onSelectShortcut) {
//       onSelectShortcut(shortcutValue);
//     }
//     setSearchTerm("");
//     onClose();
//   };

//   const renderShortcuts = () => {
//     const items = [];
//     let hasVisibleItems = false;

//     filteredShortcuts.forEach((shortcut, index) => {
//       if (shortcut.isBold) {
//         if (hasVisibleItems) {
//           items.push(
//             <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
//           );
//         }
//         items.push(
//           <div key={`header-${index}`} className="px-3 py-1.5 bg-gray-50">
//             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//               {shortcut.title}
//             </span>
//           </div>
//         );
//         hasVisibleItems = false;
//       } else {
//         items.push(
//           <button
//             key={`item-${index}`}
//             onClick={() => handleSelectShortcut(shortcut.value)}
//             className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors group focus:outline-none focus:bg-gray-100"
//           >
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-900 font-normal">
//                 {shortcut.title}
//               </span>
//               {shortcut.value && (
//                 <span className="text-xs font-mono text-gray-400 group-hover:text-gray-500">
//                   [{shortcut.value}]
//                 </span>
//               )}
//             </div>
//           </button>
//         );
//         hasVisibleItems = true;
//       }
//     });

//     if (items.length === 0) {
//       items.push(
//         <div key="empty" className="py-8 text-center">
//           <p className="text-sm text-gray-500">No shortcuts found</p>
//         </div>
//       );
//     }

//     return items;
//   };

//   if (!open || !anchorEl) return null;

//   return (
//     <div
//       className="fixed z-50"
//       style={{
//         top: position.top,
//         left: position.left,
//       }}
//     >
//       <div className="w-80 max-w-[360px] bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
//         {/* Header */}
//         <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
//           <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
//             {title}
//           </h4>
//         </div>

//         {/* Search */}
//         {showSearch && (
//           <div className="px-3 py-2 border-b border-gray-100">
//             <div className="relative">
//               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search shortcuts..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 autoFocus
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-2 top-1/2 -translate-y-1/2"
//                 >
//                   <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Shortcuts List */}
//         <div className="max-h-[400px] overflow-y-auto">
//           <div className="py-1">
//             {renderShortcuts()}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
//           <p className="text-xs text-gray-500 text-center">
//             Click on any shortcode to insert at cursor position
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShortcodePopover;


import React, { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const ShortcodePopover = ({
  open,
  anchorEl,
  onClose,
  shortcuts,
  onSelectShortcut,
  title = "Add Shortcode",
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  const filteredShortcuts = useMemo(() => {
    if (!searchTerm.trim()) return shortcuts;

    return shortcuts.filter(
      (shortcut) =>
        shortcut.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        shortcut.value
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [shortcuts, searchTerm]);

  const handleSelectShortcut = (shortcutValue) => {
    if (shortcutValue && onSelectShortcut) {
      onSelectShortcut(shortcutValue);
    }

    setSearchTerm("");

    if (onClose) {
      onClose();
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={(value) => !value && onClose()}>
      <DropdownMenuTrigger asChild>
        <div ref={() => anchorEl} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-80 p-0 overflow-hidden"
        sideOffset={6}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b bg-muted/40">
          <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">
            {title}
          </h4>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search shortcuts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 rounded-md border bg-background pl-8 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto py-1">
          {filteredShortcuts.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No shortcuts found
            </div>
          ) : (
            filteredShortcuts.map((shortcut, index) => {
              if (shortcut.isBold) {
                return (
                  <div key={index}>
                    <div className="border-t my-1" />

                    <div className="px-3 py-1.5 bg-muted/30">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {shortcut.title}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    handleSelectShortcut(shortcut.value)
                  }
                  className="w-full text-left px-3 py-2 hover:bg-accent transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {shortcut.title}
                    </span>

                    {shortcut.value && (
                      <span className="text-xs font-mono text-muted-foreground">
                        [{shortcut.value}]
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t bg-muted/40">
          <p className="text-xs text-center text-muted-foreground">
            Click on any shortcode to insert at cursor position
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShortcodePopover;