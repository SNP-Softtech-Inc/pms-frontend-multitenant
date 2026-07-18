


import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  Plus,
  Search,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const ShortcodeTextField = forwardRef(
  (
    {
      label,
      value,
      onChange,
      placeholder,
      error,
      helperText,
      multiline = false,
      rows = 4,
      shortcuts = [],
      disabled = false,
      required = false,
      maxLength,
      sx = {},
      className = "",
    },
    ref
  ) => {
    const [cursorPosition, setCursorPosition] =
      useState(0);

    const [searchTerm, setSearchTerm] =
      useState("");

    const textFieldRef = useRef(null);

    // ─────────────────────────────────────────────
    // EXPOSE METHODS
    // ─────────────────────────────────────────────

    useImperativeHandle(ref, () => ({
      focus: () => {
        textFieldRef.current?.focus();
      },

      setSelectionRange: (start, end) => {
        textFieldRef.current?.setSelectionRange(
          start,
          end
        );
      },

      get value() {
        return value;
      },
    }));

    // ─────────────────────────────────────────────
    // CURSOR TRACKING
    // ─────────────────────────────────────────────

    const updateCursorPosition = (e) => {
      if (
        e.target.selectionStart !== undefined
      ) {
        setCursorPosition(
          e.target.selectionStart
        );
      }
    };

    // ─────────────────────────────────────────────
    // INPUT CHANGE
    // ─────────────────────────────────────────────

    const handleChange = (e) => {
      setCursorPosition(
        e.target.selectionStart || 0
      );

      onChange(e);
    };

    // ─────────────────────────────────────────────
    // INSERT SHORTCODE
    // ─────────────────────────────────────────────

    const handleAddShortcut = (
      shortcutValue
    ) => {
      if (!shortcutValue) return;

      const newValue =
        value.slice(0, cursorPosition) +
        `[${shortcutValue}]` +
        value.slice(cursorPosition);

      const newCursorPosition =
        cursorPosition +
        shortcutValue.length +
        2;

      const syntheticEvent = {
        target: {
          value: newValue,
          name:
            label
              ?.toLowerCase()
              .replace(/\s/g, "_") ||
            "shortcode_field",
        },
      };

      onChange(syntheticEvent);

      setTimeout(() => {
        if (textFieldRef.current) {
          textFieldRef.current.focus();

          textFieldRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition
          );

          setCursorPosition(
            newCursorPosition
          );
        }
      }, 0);
    };

    // ─────────────────────────────────────────────
    // FILTER SHORTCODES
    // ─────────────────────────────────────────────

    const filteredShortcuts =
      shortcuts.filter((shortcut) => {
        if (shortcut.isBold) return true;

        if (!searchTerm.trim()) return true;

        return (
          shortcut.title
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          shortcut.value
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
        );
      });

    // ─────────────────────────────────────────────
    // INPUT CLASSES
    // ─────────────────────────────────────────────

    const inputClasses = `
      w-full
      rounded-xl
      border
      border-input
      bg-background
      text-foreground
      placeholder:text-muted-foreground
      px-3
      py-2.5
      text-sm
      outline-none
      transition-all
      duration-200
      focus:ring-2
      focus:ring-ring
      focus:border-primary
      disabled:opacity-50
      disabled:cursor-not-allowed
      shadow-sm
      hover:border-primary/40
      ${error ? "border-destructive focus:ring-destructive" : ""}
      ${multiline ? "resize-none" : ""}
      ${className}
    `;

    return (
      <div
        className="w-full space-y-2"
        style={sx}
      >
        {/* LABEL */}

        {label && (
          <label className="flex items-center gap-1 text-sm font-medium text-foreground">
            {label}

            {required && (
              <span className="text-destructive">
                *
              </span>
            )}
          </label>
        )}

        {/* INPUT */}

        <div className="relative">
          {multiline ? (
            <textarea
              ref={textFieldRef}
              value={value}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              onChange={handleChange}
              onSelect={
                updateCursorPosition
              }
              onFocus={
                updateCursorPosition
              }
              onClick={
                updateCursorPosition
              }
              onKeyUp={
                updateCursorPosition
              }
              className={inputClasses}
            />
          ) : (
            <input
              ref={textFieldRef}
              type="text"
              value={value}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              onChange={handleChange}
              onSelect={
                updateCursorPosition
              }
              onFocus={
                updateCursorPosition
              }
              onClick={
                updateCursorPosition
              }
              onKeyUp={
                updateCursorPosition
              }
              className={inputClasses}
            />
          )}
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* HELPER */}

          <div>
            {helperText && (
              <p
                className={`text-xs ${
                  error
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {helperText}
              </p>
            )}
          </div>

          {/* SHORTCODE DROPDOWN */}

          <DropdownMenu
            onOpenChange={(open) => {
              if (!open) {
                setSearchTerm("");

                setTimeout(() => {
                  textFieldRef.current?.focus();
                }, 0);
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (textFieldRef.current) {
                    setCursorPosition(
                      textFieldRef.current
                        .selectionStart || 0
                    );
                  }
                }}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-input
                  bg-card
                  hover:bg-accent
                  hover:text-accent-foreground
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-foreground
                  transition-all
                  duration-200
                  shadow-sm
                  hover:shadow
                  disabled:opacity-50
                  disabled:pointer-events-none
                "
              >
                <Plus className="h-4 w-4" />

                Add Shortcode
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="
                w-[340px]
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-popover
                text-popover-foreground
                shadow-2xl
                p-0
              "
            >
              {/* HEADER */}

              <div className="border-b border-border bg-muted/40 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Add Shortcode
                    </h3>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      Insert variables into your
                      content
                    </p>
                  </div>
                </div>
              </div>

              {/* SEARCH */}

              <div className="border-b border-border p-3">
                <div className="relative">
                  <Search
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      h-4
                      w-4
                      text-muted-foreground
                    "
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search shortcodes..."
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-lg
                      border
                      border-input
                      bg-background
                      text-foreground
                      pl-10
                      pr-9
                      py-2
                      text-sm
                      outline-none
                      transition-all
                      focus:ring-2
                      focus:ring-ring
                      focus:border-primary
                    "
                    autoFocus
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchTerm("")
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        -translate-y-1/2
                        rounded-md
                        p-1
                        hover:bg-accent
                        transition-colors
                      "
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {/* LIST */}

              <div className="max-h-[350px] overflow-y-auto py-1">
                {filteredShortcuts.length ===
                0 ? (
                  <div className="flex items-center justify-center py-10">
                    <p className="text-sm text-muted-foreground">
                      No shortcuts found
                    </p>
                  </div>
                ) : (
                  filteredShortcuts.map(
                    (shortcut, index) => {
                      // SECTION HEADER

                      if (shortcut.isBold) {
                        return (
                          <div key={index}>
                            <div className="my-1 border-t border-border" />

                            <div className="bg-muted/40 px-4 py-2">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {shortcut.title}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // SHORTCODE ITEM

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            handleAddShortcut(
                              shortcut.value
                            )
                          }
                          className="
                            group
                            flex
                            w-full
                            flex-col
                            items-start
                            gap-1
                            px-4
                            py-3
                            text-left
                            transition-all
                            hover:bg-accent
                            focus:bg-accent
                            outline-none
                          "
                        >
                          <span className="text-sm font-medium text-foreground">
                            {shortcut.title}
                          </span>

                          {shortcut.value && (
                            <span className="
                              rounded-md
                              bg-muted
                              px-2
                              py-0.5
                              text-[11px]
                              font-mono
                              text-muted-foreground
                              group-hover:bg-background
                            ">
                              [
                              {
                                shortcut.value
                              }
                              ]
                            </span>
                          )}
                        </button>
                      );
                    }
                  )
                )}
              </div>

              {/* FOOTER */}

              <div className="border-t border-border bg-muted/30 px-4 py-2.5">
                <p className="text-center text-[11px] text-muted-foreground">
                  Click a shortcode to insert
                  it at the current cursor
                  position
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);

ShortcodeTextField.displayName =
  "ShortcodeTextField";

export default ShortcodeTextField;