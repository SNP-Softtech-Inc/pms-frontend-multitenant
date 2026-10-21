// Tab primitives for the settings pages.
//
// Lifted from FirmSetting.js, where they were declared locally. Account
// Settings now uses the same layout, so a second private copy would have
// meant two definitions drifting apart the first time one was adjusted.
//
// FirmSetting still has its own copy and is deliberately left alone: it
// works, and migrating it is a change that can be made and checked on its
// own rather than bundled into this one. These are a faithful copy of its
// components, so switching it over later is an import change and a deletion.
import React, { useState } from "react";

export const Tabs = ({ defaultValue, children, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (child?.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child?.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab }),
    )}
  </div>
);

export const TabsTrigger = ({
  value,
  activeTab,
  setActiveTab,
  children,
  className = "",
}) => (
  <button
    type="button"
    onClick={() => setActiveTab(value)}
    className={`${className} ${
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    } transition-all`}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children, className = "" }) => {
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
};

// The chrome every settings card shares: one bordered box with a titled
// header strip. Firm Settings calls this SettingsCard.
export const SettingsCard = ({ title, action, children }) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {action}
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

// Shared so the two pages' tab bars cannot drift apart visually.
export const TAB_LIST_CLASS =
  "mb-6 h-10 w-fit gap-1 bg-muted/60 border border-border rounded-lg p-1";

export const TAB_TRIGGER_CLASS =
  "text-sm px-5 rounded-md py-1.5 transition-all";
