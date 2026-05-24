import React, { useState, useEffect, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountData } from "../../redux/accountContactSlice";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
// import { Label, Input } from "../../components/ui/form";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../components/ui/sheet";
import countryList from "react-select-country-list";
import { templateAPI } from "../../services/api";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import { folderManagementAPI,authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext"; // adjust path
export default function AccountForm({ onContinue, isEditing = false }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { accountData } = useSelector((state) => state.accountContact);
  const [errors, setErrors] = useState({});

  const [tags, setTags] = useState([]);
  const [folderTemp, setFolderTemp] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  console.log("accountdata", accountData);

  const handleChange = (e) => {
    dispatch(setAccountData({ [e.target.name]: e.target.value }));
  };

  // Fetch Folder Templates
  useEffect(() => {
    const fetchFolderTemps = async () => {
      try {
        const res = await folderManagementAPI.getFolderTemplates();
        const data = res.data;

        if (data.folderTemplates?.length > 0) {
          const folderOptions = data.folderTemplates.map((folder) => ({
            value: folder._id,
            label: folder.templatename,
          }));

          setFolderTemp(folderOptions);

          const lastTemplate = folderOptions[folderOptions.length - 1];

          // ✅ EDIT MODE
          if (isEditing) {
            if (typeof accountData.folderTemp === "string") {
              const selectedFolder = folderOptions.find(
                (f) => f.value === accountData.folderTemp,
              );

              dispatch(
                setAccountData({
                  folderTemp: selectedFolder || lastTemplate,
                }),
              );
            } else if (!accountData.folderTemp) {
              dispatch(setAccountData({ folderTemp: lastTemplate }));
            }
          }

          // ✅ NEW MODE (only if not already set)
          else if (!accountData.folderTemp) {
            dispatch(setAccountData({ folderTemp: lastTemplate }));
          }
        } else {
          setFolderTemp([]);
        }
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };

    fetchFolderTemps();
  }, [isEditing, dispatch]);

  // Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await templateAPI.getAllTags();
        const tagsData = res?.data?.tags || [];
        console.log("Fetched tags bbb:", tagsData);
        const tagsOptions = tagsData.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));
        setTags(tagsOptions);

        // If editing and we have tag IDs, map them to the correct format
        if (
          accountData.tags &&
          accountData.tags.length > 0 &&
          typeof accountData.tags[0] === "string"
        ) {
          const selectedTags = tagsOptions.filter((tag) =>
            accountData.tags.includes(tag.value),
          );
          dispatch(setAccountData({ tags: selectedTags }));
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [accountData.tags]);

 useEffect(() => {
  const fetchTeamMembers = async () => {
    try {
      const res = await authAPI.getAllUsers({
        page: 1,
        limit: 50,
        status: "active",
      });

      const users = res?.data?.users || [];

      const teamMembersOptions = users.map((user) => ({
        value: user._id,
        label: user.username,
      }));

      setTeamMembers(teamMembersOptions);

      // ================= EDIT MODE =================
      if (
        isEditing &&
        accountData.teamMember &&
        accountData.teamMember.length > 0
      ) {
        const selectedTeamMembers = teamMembersOptions.filter((member) =>
          accountData.teamMember.includes(member.value)
        );

        dispatch(setAccountData({ teamMembers: selectedTeamMembers }));
      }

      // ================= CREATE MODE =================
      else if (!isEditing && user?.id) {
        const loggedInUser = teamMembersOptions.find(
          (member) => member.value === user.id
        );

        if (loggedInUser) {
          console.log("Auto-selecting logged-in user:", loggedInUser);

          dispatch(
            setAccountData({ teamMembers: [loggedInUser] })
          );
        }
      }
    } catch (err) {
      console.error("User fetch error:", err?.response || err);
    }
  };

  fetchTeamMembers();
}, [isEditing, accountData.teamMember, user]);

  const handleAutocompleteChange = (field, newValue) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    dispatch(setAccountData({ [field]: newValue }));
  };

  const options = useMemo(() => countryList().getData(), []);
 const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring";
 


  return (
  // <div className="flex flex-col h-full">
  //   {/* Scrollable content */}
  //   <div className="flex-1 overflow-y-auto space-y-6 pb-2 px-4">

  //     {/* Client Type */}
  //     <div className="space-y-3">
  //       <SheetHeader className="px-0 py-0 space-y-0.5">
  //         <SheetTitle className="text-sm font-semibold">Client Type</SheetTitle>
  //         <SheetDescription className="text-xs">
  //           Select whether this is an individual or company account.
  //         </SheetDescription>
  //       </SheetHeader>

  //       <div className="flex items-center gap-6">
  //         {["Individual", "Company"].map((type) => (
  //           <label key={type} className="flex items-center gap-2 cursor-pointer">
  //             <input
  //               type="radio"
  //               name="clientType"
  //               value={type}
  //               checked={(accountData.clientType || "") === type}
  //               onChange={handleChange}
  //               className="h-4 w-4 accent-primary"
  //             />
  //             <span className="text-sm text-foreground">{type}</span>
  //           </label>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Account Info */}
  //     <div className="space-y-3">
  //       <SheetHeader className="px-0 py-0 space-y-0.5">
  //         <SheetTitle className="text-sm font-semibold">Account Info</SheetTitle>
  //         <SheetDescription className="text-xs">
  //           Enter the primary account details.
  //         </SheetDescription>
  //       </SheetHeader>

  //       <div className="space-y-3">
  //         <div className="space-y-1.5">
  //           <Label>
  //             Account Name <span className="text-destructive">*</span>
  //           </Label>
  //           <Input
  //             name="accountName"
  //             value={accountData.accountName || ""}
  //             placeholder="Account Name"
  //             className={errors.accountName ? "border-destructive" : ""}
  //             onChange={handleChange}
  //           />
  //           {errors.accountName && (
  //             <p className="text-xs text-destructive">{errors.accountName}</p>
  //           )}
  //         </div>

  //         {accountData.clientType === "Company" && (
  //           <div className="space-y-1.5">
  //             <Label>
  //               Company Name <span className="text-destructive">*</span>
  //             </Label>
  //             <Input
  //               name="companyName"
  //               value={accountData.companyName || ""}
  //               placeholder="Company Name"
  //               className={errors.companyName ? "border-destructive" : ""}
  //               onChange={handleChange}
  //             />
  //             {errors.companyName && (
  //               <p className="text-xs text-destructive">
  //                 {errors.companyName}
  //               </p>
  //             )}
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Assignment */}
  //     <div className="space-y-3">
  //       <SheetHeader className="px-0 py-0 space-y-0.5">
  //         <SheetTitle className="text-sm font-semibold">Assignment</SheetTitle>
  //         <SheetDescription className="text-xs">
  //           Assign team members, tags and a folder template.
  //         </SheetDescription>
  //       </SheetHeader>

  //       <div className="space-y-3">
  //         <MultiSelectDropdown
  //           value={accountData.teamMembers || []}
  //           onChange={(newValue) =>
  //             dispatch(setAccountData({ teamMembers: newValue }))
  //           }
  //           options={teamMembers}
  //           placeholder="Select Team Members"
  //           width="100%"
  //         />

  //         <TagsMultiSelectDropDown
  //           value={accountData.tags || []}
  //           onChange={(newValue) =>
  //             dispatch(setAccountData({ tags: newValue }))
  //           }
  //           options={tags}
  //           placeholder="Select tags"
  //         />

  //         <div className="space-y-1.5">
  //           <Label>
  //             Folder Template <span className="text-destructive">*</span>
  //           </Label>
  //           <select
  //             value={accountData.folderTemp?.value || ""}
  //             onChange={(e) => {
  //               const opt =
  //                 folderTemp.find((f) => f.value === e.target.value) || null;
  //               handleAutocompleteChange("folderTemp", opt);
  //             }}
  //             className={selectCls}
  //           >
  //             <option value="">Select Folder Template</option>
  //             {folderTemp.map((f) => (
  //               <option key={f.value} value={f.value}>
  //                 {f.label}
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Address */}
  //     {accountData.clientType === "Company" && (
  //       <div className="space-y-3">
  //         <SheetHeader className="px-0 py-0 space-y-0.5">
  //           <SheetTitle className="text-sm font-semibold">Address</SheetTitle>
  //           <SheetDescription className="text-xs">
  //             Company billing or mailing address.
  //           </SheetDescription>
  //         </SheetHeader>

  //         <div className="space-y-3">
  //           <div className="space-y-1.5">
  //             <Label>Country</Label>
  //             <select
  //               value={
  //                 options.find(
  //                   (o) => o.label === accountData?.country?.label
  //                 )?.value || ""
  //               }
  //               onChange={(e) => {
  //                 const found =
  //                   options.find((o) => o.value === e.target.value) || null;
  //                 dispatch(setAccountData({ country: found }));
  //               }}
  //               className={selectCls}
  //             >
  //               <option value="">Select Country</option>
  //               {options.map((o) => (
  //                 <option key={o.value} value={o.value}>
  //                   {o.label}
  //                 </option>
  //               ))}
  //             </select>
  //           </div>

  //           <div className="space-y-1.5">
  //             <Label>Street Address</Label>
  //             <Input
  //               name="streetAddress"
  //               value={accountData.streetAddress || ""}
  //               placeholder="Street address"
  //               onChange={handleChange}
  //             />
  //           </div>

  //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  //             <div className="space-y-1.5">
  //               <Label>City</Label>
  //               <Input
  //                 name="city"
  //                 value={accountData.city || ""}
  //                 placeholder="City"
  //                 onChange={handleChange}
  //               />
  //             </div>

  //             <div className="space-y-1.5">
  //               <Label>State</Label>
  //               <Input
  //                 name="state"
  //                 value={accountData.state || ""}
  //                 placeholder="State"
  //                 onChange={handleChange}
  //               />
  //             </div>

  //             <div className="space-y-1.5">
  //               <Label>ZIP Code</Label>
  //               <Input
  //                 name="postalCode"
  //                 value={accountData.postalCode || ""}
  //                 placeholder="ZIP Code"
  //                 onChange={handleChange}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>

  //   {/* Footer */}
  //   <SheetFooter className="border-t border-border/40 pt-3 pb-1">
  //     <div className="flex justify-end w-full">
  //       <Button size="sm" onClick={onContinue} className="gap-1.5">
  //         Continue
  //       </Button>
  //     </div>
  //   </SheetFooter>
  // </div>

  <div
  className="
    flex flex-col h-full
    bg-background text-foreground
  "
  style={{
    fontFamily: "var(--font-family)",
    fontSize: "calc(0.875rem * (var(--font-scale) / 100))",
  }}
>
  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-8">

    {/* ───────────────── Client Type ───────────────── */}
    <section className="space-y-4">
      <div className="space-y-1">
        <SheetTitle
          className="font-semibold tracking-tight text-foreground"
          style={{
            fontSize:
              "calc(1rem * (var(--font-scale) / 100))",
          }}
        >
          Client Type
        </SheetTitle>

        <SheetDescription
          className="text-muted-foreground leading-relaxed"
          style={{
            fontSize:
              "calc(0.78rem * (var(--font-scale) / 100))",
          }}
        >
          Choose whether this account belongs to an
          individual client or a company organization.
        </SheetDescription>
      </div>

      <div className="flex flex-wrap gap-3">
        {["Individual", "Company"].map((type) => {
          const active =
            (accountData.clientType || "") === type;

          return (
            <label
              key={type}
              className={`
                flex items-center gap-2 cursor-pointer
                rounded-xl border px-4 py-3
                transition-all duration-200
                min-w-[140px]
                ${
                  active
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                }
              `}
            >
              <input
                type="radio"
                name="clientType"
                value={type}
                checked={active}
                onChange={handleChange}
                className="h-4 w-4 accent-primary"
              />

              <span
                className="font-medium text-foreground"
                style={{
                  fontSize:
                    "calc(0.86rem * (var(--font-scale) / 100))",
                }}
              >
                {type}
              </span>
            </label>
          );
        })}
      </div>
    </section>

    {/* ───────────────── Account Information ───────────────── */}
    <section className="space-y-5">
      <div className="space-y-1">
        <SheetTitle
          className="font-semibold tracking-tight text-foreground"
          style={{
            fontSize:
              "calc(1rem * (var(--font-scale) / 100))",
          }}
        >
          Account Information
        </SheetTitle>

        <SheetDescription
          className="text-muted-foreground leading-relaxed"
          style={{
            fontSize:
              "calc(0.78rem * (var(--font-scale) / 100))",
          }}
        >
          Provide the primary details associated with
          this account.
        </SheetDescription>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Account Name */}
        <div className="space-y-2">
          <Label
            className="font-medium text-foreground"
            style={{
              fontSize:
                "calc(0.82rem * (var(--font-scale) / 100))",
            }}
          >
            Account Name
            <span className="text-destructive ml-1">*</span>
          </Label>

          <Input
            name="accountName"
            value={accountData.accountName || ""}
            placeholder="Enter account name"
            className={`
              h-10 rounded-xl bg-background
              shadow-sm transition-all
              focus-visible:ring-2 focus-visible:ring-primary/30
              ${errors.accountName ? "border-destructive" : ""}
            `}
            onChange={handleChange}
            style={{
              fontSize:
                "calc(0.86rem * (var(--font-scale) / 100))",
            }}
          />

          {errors.accountName && (
            <p
              className="text-destructive"
              style={{
                fontSize:
                  "calc(0.72rem * (var(--font-scale) / 100))",
              }}
            >
              {errors.accountName}
            </p>
          )}
        </div>

        {/* Company Name */}
        {accountData.clientType === "Company" && (
          <div className="space-y-2">
            <Label
              className="font-medium text-foreground"
              style={{
                fontSize:
                  "calc(0.82rem * (var(--font-scale) / 100))",
              }}
            >
              Company Name
              <span className="text-destructive ml-1">*</span>
            </Label>

            <Input
              name="companyName"
              value={accountData.companyName || ""}
              placeholder="Enter company name"
              className={`
                h-10 rounded-xl bg-background
                shadow-sm transition-all
                focus-visible:ring-2 focus-visible:ring-primary/30
                ${errors.companyName ? "border-destructive" : ""}
              `}
              onChange={handleChange}
              style={{
                fontSize:
                  "calc(0.86rem * (var(--font-scale) / 100))",
              }}
            />

            {errors.companyName && (
              <p
                className="text-destructive"
                style={{
                  fontSize:
                    "calc(0.72rem * (var(--font-scale) / 100))",
                }}
              >
                {errors.companyName}
              </p>
            )}
          </div>
        )}
      </div>
    </section>

    {/* ───────────────── Assignment ───────────────── */}
    <section className="space-y-5">
      <div className="space-y-1">
        <SheetTitle
          className="font-semibold tracking-tight text-foreground"
          style={{
            fontSize:
              "calc(1rem * (var(--font-scale) / 100))",
          }}
        >
          Assignment & Organization
        </SheetTitle>

        <SheetDescription
          className="text-muted-foreground leading-relaxed"
          style={{
            fontSize:
              "calc(0.78rem * (var(--font-scale) / 100))",
          }}
        >
          Assign internal team members, attach tags,
          and choose a folder template structure.
        </SheetDescription>
      </div>

      <div className="space-y-4">
        <MultiSelectDropdown
          value={accountData.teamMembers || []}
          onChange={(newValue) =>
            dispatch(
              setAccountData({
                teamMembers: newValue,
              })
            )
          }
          options={teamMembers}
          placeholder="Select Team Members"
          width="100%"
        />

        <TagsMultiSelectDropDown
          value={accountData.tags || []}
          onChange={(newValue) =>
            dispatch(
              setAccountData({
                tags: newValue,
              })
            )
          }
          options={tags}
          placeholder="Select tags"
        />

        <div className="space-y-2">
          <Label
            className="font-medium text-foreground"
            style={{
              fontSize:
                "calc(0.82rem * (var(--font-scale) / 100))",
            }}
          >
            Folder Template
            <span className="text-destructive ml-1">*</span>
          </Label>

          <select
            value={accountData.folderTemp?.value || ""}
            onChange={(e) => {
              const opt =
                folderTemp.find(
                  (f) => f.value === e.target.value
                ) || null;

              handleAutocompleteChange(
                "folderTemp",
                opt
              );
            }}
            className="
              h-10 w-full rounded-xl
              border border-input
              bg-background
              px-3 shadow-sm
              text-foreground
              outline-none
              transition-all
              focus:ring-2 focus:ring-primary/30
            "
            style={{
              fontSize:
                "calc(0.86rem * (var(--font-scale) / 100))",
            }}
          >
            <option value="">
              Select Folder Template
            </option>

            {folderTemp.map((f) => (
              <option
                key={f.value}
                value={f.value}
              >
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>

    {/* ───────────────── Address ───────────────── */}
    {accountData.clientType === "Company" && (
      <section className="space-y-5">
        <div className="space-y-1">
          <SheetTitle
            className="font-semibold tracking-tight text-foreground"
            style={{
              fontSize:
                "calc(1rem * (var(--font-scale) / 100))",
            }}
          >
            Business Address
          </SheetTitle>

          <SheetDescription
            className="text-muted-foreground leading-relaxed"
            style={{
              fontSize:
                "calc(0.78rem * (var(--font-scale) / 100))",
            }}
          >
            Enter the official mailing or billing
            address for the company.
          </SheetDescription>
        </div>

        <div className="space-y-4">
          {/* Country */}
          <div className="space-y-2">
            <Label
              className="font-medium text-foreground"
              style={{
                fontSize:
                  "calc(0.82rem * (var(--font-scale) / 100))",
              }}
            >
              Country
            </Label>

            <select
              value={
                options.find(
                  (o) =>
                    o.label ===
                    accountData?.country?.label
                )?.value || ""
              }
              onChange={(e) => {
                const found =
                  options.find(
                    (o) =>
                      o.value === e.target.value
                  ) || null;

                dispatch(
                  setAccountData({
                    country: found,
                  })
                );
              }}
              className="
                h-10 w-full rounded-xl
                border border-input
                bg-background
                px-3 shadow-sm
                text-foreground
                outline-none
                transition-all
                focus:ring-2 focus:ring-primary/30
              "
              style={{
                fontSize:
                  "calc(0.86rem * (var(--font-scale) / 100))",
              }}
            >
              <option value="">
                Select Country
              </option>

              {options.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                >
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Street */}
          <div className="space-y-2">
            <Label
              className="font-medium text-foreground"
              style={{
                fontSize:
                  "calc(0.82rem * (var(--font-scale) / 100))",
              }}
            >
              Street Address
            </Label>

            <Input
              name="streetAddress"
              value={accountData.streetAddress || ""}
              placeholder="Street address"
              onChange={handleChange}
              className="
                h-10 rounded-xl shadow-sm
                focus-visible:ring-2
                focus-visible:ring-primary/30
              "
              style={{
                fontSize:
                  "calc(0.86rem * (var(--font-scale) / 100))",
              }}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                className="font-medium text-foreground"
                style={{
                  fontSize:
                    "calc(0.82rem * (var(--font-scale) / 100))",
                }}
              >
                City
              </Label>

              <Input
                name="city"
                value={accountData.city || ""}
                placeholder="City"
                onChange={handleChange}
                className="
                  h-10 rounded-xl shadow-sm
                  focus-visible:ring-2
                  focus-visible:ring-primary/30
                "
                style={{
                  fontSize:
                    "calc(0.86rem * (var(--font-scale) / 100))",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="font-medium text-foreground"
                style={{
                  fontSize:
                    "calc(0.82rem * (var(--font-scale) / 100))",
                }}
              >
                State
              </Label>

              <Input
                name="state"
                value={accountData.state || ""}
                placeholder="State"
                onChange={handleChange}
                className="
                  h-10 rounded-xl shadow-sm
                  focus-visible:ring-2
                  focus-visible:ring-primary/30
                "
                style={{
                  fontSize:
                    "calc(0.86rem * (var(--font-scale) / 100))",
                }}
              />
            </div>

            <div className="space-y-2">
              <Label
                className="font-medium text-foreground"
                style={{
                  fontSize:
                    "calc(0.82rem * (var(--font-scale) / 100))",
                }}
              >
                ZIP Code
              </Label>

              <Input
                name="postalCode"
                value={accountData.postalCode || ""}
                placeholder="ZIP Code"
                onChange={handleChange}
                className="
                  h-10 rounded-xl shadow-sm
                  focus-visible:ring-2
                  focus-visible:ring-primary/30
                "
                style={{
                  fontSize:
                    "calc(0.86rem * (var(--font-scale) / 100))",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    )}
  </div>

  {/* Footer */}
  <SheetFooter
    className="
      border-t border-border/60
      px-5 py-4
      bg-background/95 backdrop-blur
    "
  >
    <div className="flex justify-end w-full">
      <Button
        size="sm"
        onClick={onContinue}
        className="
          h-10 px-6 rounded-xl
          shadow-sm transition-all
          hover:shadow-md
        "
        style={{
          fontSize:
            "calc(0.85rem * (var(--font-scale) / 100))",
        }}
      >
        Continue
      </Button>
    </div>
  </SheetFooter>
</div>
);
}
