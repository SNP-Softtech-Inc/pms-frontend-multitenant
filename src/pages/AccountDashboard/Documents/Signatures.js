import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FileSignature } from "lucide-react";
const Signatures = () => {
 const { accountId } = useParams();
 console.log("accoiunt id for sign",accountId)
   const SIGNATURE_API =process.env.REACT_APP_ESIGNATURE_API;
   const [signatureList,setSignatureList]=useState([])
    const { data } = useParams();
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await axios.get(
          `${SIGNATURE_API}/signautrelist/${accountId}`
        );
        console.log("Signature list response:", res.data);
        setSignatureList(res.data || []);
      } catch (err) {
        console.error("Error fetching approvals:", err);
      }
    };
    fetchApprovals();
  }, [accountId]);
  const statusStyles = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "signed") return "bg-green-50 text-green-700 border border-green-200";
    if (s === "rejected" || s === "declined") return "bg-red-50 text-red-700 border border-red-200";
    if (s === "pending") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  return (
  <div className="p-4 md:p-6 bg-background min-h-full">
    {/* Header */}
    <div className="mb-5">
      <h2
        className="text-base font-semibold text-foreground"
        style={{
          fontFamily: "var(--font-family)",
          fontSize:
            "calc(1rem * parseFloat(var(--font-scale)) / 100)",
        }}
      >
        Signatures
      </h2>

      <p
        className="mt-1 text-muted-foreground"
        style={{
          fontFamily: "var(--font-family)",
          fontSize:
            "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
        }}
      >
        E-signature requests for this account
      </p>
    </div>

    {/* Table Container */}
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                className="
                  px-4 py-3
                  text-left
                  uppercase
                  tracking-wide
                  text-muted-foreground
                  font-semibold
                  whitespace-nowrap
                "
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(0.72rem * parseFloat(var(--font-scale)) / 100)",
                }}
              >
                Document Name
              </th>

              <th
                className="
                  px-4 py-3
                  text-left
                  uppercase
                  tracking-wide
                  text-muted-foreground
                  font-semibold
                  whitespace-nowrap
                "
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(0.72rem * parseFloat(var(--font-scale)) / 100)",
                }}
              >
                Status
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border">
            {signatureList.length > 0 ? (
              signatureList.map((signautrelist, index) => (
                <tr
                  key={signautrelist._id || index}
                  className="
                    transition-colors
                    hover:bg-muted/30
                  "
                >
                  {/* File Name */}
                  <td
                    className="px-4 py-3 font-medium text-foreground"
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "calc(0.88rem * parseFloat(var(--font-scale)) / 100)",
                    }}
                  >
                    {signautrelist.filename || "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`
                        inline-flex items-center
                        rounded-full
                        px-2.5 py-1
                        text-[11px]
                        font-semibold
                        ring-1 ring-inset
                        ${statusStyles(signautrelist.status)}
                      `}
                      style={{
                        fontFamily: "var(--font-family)",
                      }}
                    >
                      {signautrelist.status || "—"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-14 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-full
                        border border-border
                        bg-muted/40
                      "
                    >
                      <FileSignature
                        size={18}
                        className="text-muted-foreground/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <p
                        className="font-medium text-foreground"
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.9rem * parseFloat(var(--font-scale)) / 100)",
                        }}
                      >
                        No signatures found
                      </p>

                      <p
                        className="text-muted-foreground"
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
                        }}
                      >
                        Signature requests will appear here.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

  // return (
  //   <div className="p-4 md:p-6">
  //     <div className="mb-4">
  //       <h2 className="text-base font-semibold text-gray-800">Signatures</h2>
  //       <p className="text-xs text-gray-400 mt-0.5">E-signature requests for this account</p>
  //     </div>

  //     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
  //       <div className="overflow-x-auto">
  //         <table className="w-full text-sm">
  //           <thead>
  //             <tr className="bg-gray-50 border-b border-gray-200">
  //               <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Document Name</th>
  //               <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
  //             </tr>
  //           </thead>
  //           <tbody className="divide-y divide-gray-100">
  //             {signatureList.length > 0 ? (
  //               signatureList.map((signautrelist, index) => (
  //                 <tr key={signautrelist._id || index} className="hover:bg-gray-50 transition-colors">
  //                   <td className="px-4 py-3 font-medium text-gray-800">{signautrelist.filename || "—"}</td>
  //                   <td className="px-4 py-3">
  //                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles(signautrelist.status)}`}>
  //                       {signautrelist.status || "—"}
  //                     </span>
  //                   </td>
  //                 </tr>
  //               ))
  //             ) : (
  //               <tr>
  //                 <td colSpan={2} className="px-4 py-12 text-center">
  //                   <div className="flex flex-col items-center gap-2">
  //                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
  //                       <FileSignature size={18} className="text-gray-300" />
  //                     </div>
  //                     <p className="text-sm text-gray-400">No signatures found</p>
  //                   </div>
  //                 </td>
  //               </tr>
  //             )}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default Signatures