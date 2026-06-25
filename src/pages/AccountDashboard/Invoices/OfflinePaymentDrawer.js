

import React, { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown";

import { RiDeleteBin6Line } from "react-icons/ri";
import { X } from "lucide-react";


import dayjs from "dayjs";
import { useToastContext } from "../../../context/ToastContext";

const OfflinePaymentDrawer = ({ open, onClose }) => {

const { showToast } = useToastContext();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [saving, setSaving]= useState(false)

 
  if (!open) return null;

  return (
  <div className="fixed inset-0 z-50 overflow-hidden">

    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Drawer */}
    <div className="
      absolute right-0 top-0 h-full w-full sm:w-[650px]
      bg-background text-foreground
      shadow-xl flex flex-col
      border-l border-border
    ">

      {/* Header */}
      <div className="
        flex items-center justify-between px-5 py-4
        border-b border-border shrink-0
      ">
        <h2 className="text-base font-semibold text-foreground">
       Offline Payment
        </h2>

        <button
          onClick={onClose}
          className="
            p-1 rounded-md
            text-muted-foreground
            hover:text-foreground hover:bg-accent
            transition-colors
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-col gap-5">

          {/* Account */}
          <SingleSelectDropdown
            value={selectedAccount}
            onChange={setSelectedAccount}
          />

     

        </div>
      </div>

      {/* Footer */}
      <div className="
        flex items-center justify-end gap-3 px-5 py-4
        border-t border-border shrink-0
        bg-background
      ">

        <button
          onClick={onClose}
          className="
            h-9 px-4 text-sm font-medium
            border border-border rounded-lg
            text-foreground hover:bg-accent
          "
        >
          Cancel
        </button>

        <button
         
          disabled={saving}
          className="
            h-9 px-4 text-sm font-medium
            bg-primary text-primary-foreground
            rounded-lg hover:bg-primary/90
            transition-colors disabled:opacity-50
          "
        >
          {saving ? "Saving..." : "Save"}
        </button>

      </div>

    </div>
  </div>
);
};

export default OfflinePaymentDrawer;
