import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { contactsAPI } from "../../services/api";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Loader2 } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import {useToastContext} from "../../context/ToastContext"
import { useQueryClient } from "@tanstack/react-query";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";
import { ScrollArea } from "../../components/ui/scroll-area";
const NewContactDrawer = ({ open, onClose, selectedContact, mode,onContactUpdated }) => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const queryClient = useQueryClient();
  const [selectedCountry, setSelectedCountry] = useState(null);
const { showToast } = useToastContext();
  // Individual state hooks for form fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [note, setNote] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [combinedValues, setCombinedValues] = useState();
  const [ssnError, setSsnError] = useState("");
  console.log(selectedCountry);
  // SSN auto-formatter
  const formatSSN = (value) => {
    const v = value.replace(/\D/g, "").slice(0, 9); // only digits

    if (v.length > 5) return `${v.slice(0, 3)}-${v.slice(3, 5)}-${v.slice(5)}`;
    if (v.length > 3) return `${v.slice(0, 3)}-${v.slice(3)}`;
    return v;
  };

  // SSN validation rules
  const validateSSN = (value) => {
    const cleaned = value.replace(/-/g, "");

    if (cleaned.length !== 9) return "SSN must be 9 digits";

    if (/^(000|666|9\d{2})/.test(cleaned)) return "Invalid SSN starting digits";
    if (/^\d{3}00\d{4}$/.test(cleaned)) return "Invalid SSN middle digits";
    if (/^\d{5}0000$/.test(cleaned)) return "Invalid SSN last digits";

    return ""; // valid
  };

  useEffect(() => {
    if (mode === "edit" && selectedContact) {
      console.log("selected contact edited", selectedContact);
      setFirstName(selectedContact.firstName || "");
      setMiddleName(selectedContact.middleName || "");
      setLastName(selectedContact.lastName || "");
      setContactName(selectedContact.contactName || "");
      setCompanyName(selectedContact.companyName || "");
      setEmail(selectedContact.email || "");
      setNote(selectedContact.note || "");
      setSsn(selectedContact.ssn || "");

      setStreetAddress(selectedContact.streetAddress || "");
      setCity(selectedContact.city || "");
      setState(selectedContact.state || "");
      setPostalCode(selectedContact.postalCode || "");
      if (selectedContact.country) {
        const countryOption = options.find(
          (opt) =>
            opt.value === selectedContact.country.code ||
            opt.label === selectedContact.country.name,
        );
        setSelectedCountry(countryOption || null);
      }
      // phones
      const phones =
        selectedContact.phoneNumbers?.map((p, i) => ({
          id: Date.now() + i,
          phone: p,
          country: "us",
        })) || [];

      setPhoneNumbers(phones);

      // tags
      // ✅ FIX TAGS
      if (selectedContact.tags && selectedContact.tags.length > 0) {
        const formattedTags = selectedContact.tags.map((tag) => ({
          label: tag.tagName,
          value: tag._id,
          colour: tag.tagColour,
        }));

        setSelectedTags(formattedTags); // 👈 IMPORTANT (for UI)
        setCombinedValues(formattedTags.map((t) => t.value)); // 👈 for API
      } else {
        setSelectedTags([]);
        setCombinedValues([]);
      }
    }

    if (mode === "create") {
      resetForm();
    }
  }, [selectedContact, mode]);

  const resetForm = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setContactName("");
    setCompanyName("");
    setEmail("");
    setNote("");
    setSsn("");
    setStreetAddress("");
    setCity("");
    setState("");
    setPostalCode("");
    setPhoneNumbers([]);
    setSelectedTags([]);
    setCombinedValues([]);
  };

  // Main change handler
  const handleSSNChange = (e) => {
    const formatted = formatSSN(e.target.value);
    setSsn(formatted);

    const error = validateSSN(formatted);
    setSsnError(error); // "" means no error
  };

  const options = useMemo(() => countryList().getData(), []);

  const handlePhoneNumberChange = (phoneValue, countryData, id) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.map((item) =>
        item.id === id
          ? {
              ...item,
              phone: phoneValue,
              countryCode: countryData.dialCode, // Store country dial code
              country: countryData.countryCode.toLowerCase(), // Store country code (e.g., 'us')
            }
          : item,
      ),
    );
  };
  // Update contactName when firstName, middleName, or lastName changes
  useEffect(() => {
    setContactName(`${firstName} ${middleName} ${lastName}`.trim());
  }, [firstName, middleName, lastName]);

  const handleAddPhoneNumber = () => {
    setPhoneNumbers((prevPhoneNumbers) => [
      ...prevPhoneNumbers,
      {
        id: Date.now(),
        phone: "",
        country: "us", // Default country
        isPrimary: false,
      },
    ]);
  };

  const handleDeletePhoneNumber = (id) => {
    setPhoneNumbers((prevPhoneNumbers) =>
      prevPhoneNumbers.filter((item) => item.id !== id),
    );
  };

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmaileError] = useState("");
  const validateForm = () => {
    let isValid = true;
    if (!firstName) {
      setFirstNameError("First name is required");

      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // ✅ Check: At least Email OR Phone Number
    const hasEmail = email?.trim();
    const hasPhone = phoneNumbers.some((p) => p.phone && p.phone.trim() !== "");

    if (!hasEmail && !hasPhone) {
      showToast({
        title: "At least Email or Phone Number is required",
        type: "info",
      });
      // setEmaileError("Email or Phone Number is required");
      isValid = false;
    } else {
      setEmaileError("");
    }

    // ✅ If email exists, validate format
    if (hasEmail) {
      if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
        setEmaileError("Please enter a valid email address.");
        isValid = false;
      }
    }
    return isValid;
  };

  const sendingData = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
      setLoading(true);

    const formattedPhoneNumbers = phoneNumbers.map((item) => item.phone);
    const countryPayload = selectedCountry
      ? { name: selectedCountry.label, code: selectedCountry.value }
      : null;
    const payload = {
      firstName,
      middleName,
      lastName,
      contactName,
      companyName,
      note,
      ssn,
      email,
      tags: combinedValues,
      country: countryPayload,
      streetAddress,
      city,
      state,
      postalCode,
      phoneNumbers: formattedPhoneNumbers,
    };

    try {
      if (mode === "edit") {
        await contactsAPI.updateContactWithoutPassword(
          selectedContact._id,
          payload,
        );
        showToast({
          title: "Contact updated successfully!",
          type: "success",
        });
      } else {
        await contactsAPI.createContact(payload);
        showToast({
          title: "Contact created successfully!",
          type: "success",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      //  onContactUpdated();
      onClose();
    
    } catch (error) {
      showToast({
        title: "Something went wrong",
        type: "error",
      });
    }
    finally { 
      setLoading(false);  
    }
  };

  const [selectedTags, setSelectedTags] = useState([]);

  //Tag FetchData ================
  const handleTagChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
    console.log(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  return (

  <div>
    {open && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Drawer */}
    <div className="absolute right-0 top-0 h-full w-full sm:w-[720px] bg-background border-l border-border shadow-2xl flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-background">
            <div className="space-y-1">
            <div
                className="
                  text-lg font-semibold tracking-tight
                  text-foreground
                "
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(1.05rem * var(--font-scale, 100) / 100)",
                }}
              >
                {mode === "edit"
                  ? "Edit Contact"
                  : "New Contact"}
              </div>

              <p
                className="
                  text-sm text-muted-foreground
                "
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(0.82rem * var(--font-scale, 100) / 100)",
                }}
              >
                Manage personal details, communication,
                tags and address information.
              </p>
            </div>

            <div
              className="
                h-10 w-10
                rounded-2xl
                border border-primary/20
                bg-primary/10
                flex items-center justify-center cursor-pointer
              "
              onClick={onClose}
            >
              <span className="text-sm font-semibold text-primary">
                {mode === "edit" ? "E" : "N"}
              </span>
            </div>
          
         
      </div>

      {/* Scrollable Body */}
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">

             <div className="px-6 py-5 space-y-6">
        {/* Name Section */}
        <div
          className="
            rounded-2xl
            border border-border/60
            bg-muted/20
            p-5
            space-y-4

            dark:bg-muted/10
          "
        >
          <div>
            <h3
              className="
                text-sm font-semibold
                text-foreground
              "
            >
              Personal Information
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Basic contact identification details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="First Name *"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              className="
                h-11 rounded-xl
                border-border/60
                bg-background/80
                focus-visible:ring-primary/20
              "
            />

            <Input
              placeholder="Middle Name"
              value={middleName}
              onChange={(e) =>
                setMiddleName(e.target.value)
              }
              className="
                h-11 rounded-xl
                border-border/60
                bg-background/80
              "
            />

            <Input
              placeholder="Last Name *"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              className="
                h-11 rounded-xl
                border-border/60
                bg-background/80
              "
            />
          </div>

          <Input
            value={contactName}
            placeholder="Contact Name"
            onChange={(e) =>
              setContactName(e.target.value)
            }
            className="
              h-11 rounded-xl
              border-border/60
              bg-background/80
            "
          />

          <Input
            value={companyName}
            placeholder="Company Name"
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
            className="
              h-11 rounded-xl
              border-border/60
              bg-background/80
            "
          />

          <Input
            value={email}
            placeholder="Email Address"
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              h-11 rounded-xl
              border-border/60
              bg-background/80
            "
          />
        </div>

        {/* Tags & Notes */}
        <div
          className="
            rounded-2xl
            border border-border/60
            bg-muted/20
            p-5
            space-y-4

            dark:bg-muted/10
          "
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Additional Details
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Organize contacts with tags and notes.
            </p>
          </div>

          <TagsMultiSelectDropDown
            value={selectedTags}
            onChange={handleTagChange}
            placeholder="Select tags"
          />

          <Textarea
            value={note}
            placeholder="Write a note..."
            onChange={(e) => setNote(e.target.value)}
            className="
              min-h-[110px]
              rounded-xl
              border-border/60
              bg-background/80
              resize-none
            "
          />

          <Input
            value={ssn}
            placeholder="SSN"
            onChange={handleSSNChange}
            className="
              h-11 rounded-xl
              border-border/60
              bg-background/80
            "
          />
        </div>

        {/* Phone Numbers */}
        <div
          className="
            rounded-2xl
            border border-border/60
            bg-muted/20
            p-5
            space-y-4

            dark:bg-muted/10
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Phone Numbers
              </h3>

              <p className="text-xs text-muted-foreground mt-1">
                Add one or multiple phone numbers.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPhoneNumber}
              className="
                inline-flex items-center gap-1.5
                rounded-xl
                border border-primary/20
                bg-primary/10
                px-3 py-2

                text-xs font-medium text-primary

                transition-all duration-200
                hover:bg-primary/15
              "
            >
              <AiOutlinePlusCircle className="h-4 w-4" />
              Add Phone
            </button>
          </div>

          <div className="space-y-3">
            {phoneNumbers.map((phone) => (
              <div
                key={phone.id}
                className="flex items-center gap-2"
              >
                <div className="flex-1 min-w-0">
                  <PhoneInput
                    country="us"
                    value={phone.phone}
                    onChange={(val) =>
                      setPhoneNumbers((prev) =>
                        prev.map((p) =>
                          p.id === phone.id
                            ? {
                                ...p,
                                phone: val,
                              }
                            : p
                        )
                      )
                    }
                    inputStyle={{
                      width: "100%",
                      height: "44px",
                      fontSize: "14px",
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--background))",
                      color: "hsl(var(--foreground))",
                    }}
                    buttonStyle={{
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                      borderColor:
                        "hsl(var(--border))",
                      background:
                        "hsl(var(--background))",
                    }}
                    containerStyle={{
                      width: "100%",
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDeletePhoneNumber(phone.id)
                  }
                  className="
                    inline-flex
                    h-11 w-11
                    items-center justify-center

                    rounded-xl

                    border border-border/60
                    bg-background/70

                    text-muted-foreground
                    transition-all duration-200

                    hover:border-destructive/20
                    hover:bg-destructive/10
                    hover:text-destructive
                  "
                >
                  <AiOutlineDelete className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div
          className="
            rounded-2xl
            border border-border/60
            bg-muted/20
            p-5
            space-y-4

            dark:bg-muted/10
          "
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Address Information
            </h3>

            <p className="text-xs text-muted-foreground mt-1">
              Contact mailing and regional details.
            </p>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="
                  w-full h-11
                  justify-between

                  rounded-xl
                  border-border/60
                  bg-background/80

                  font-normal
                  text-muted-foreground

                  hover:bg-muted/30
                "
              >
                {selectedCountry?.label ||
                  "Select Country"}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="
                w-[var(--radix-popover-trigger-width)]
                rounded-2xl
                border border-border/60
                p-0
                shadow-xl
              "
            >
              <Command className="rounded-2xl">
                <CommandInput
                  placeholder="Search country..."
                />

                <CommandList>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      onSelect={() =>
                        setSelectedCountry(opt)
                      }
                      className="cursor-pointer"
                    >
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Street Address"
            value={streetAddress}
            onChange={(e) =>
              setStreetAddress(e.target.value)
            }
            className="
              h-11 rounded-xl
              border-border/60
              bg-background/80
            "
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="City"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              className="
                h-11 rounded-xl
                border-border/60
                bg-background/80
              "
            />

            <Input
              placeholder="State"
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
              className="
                h-11 rounded-xl
                border-border/60
                bg-background/80
              "
            />

            <Input
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) =>
                setPostalCode(e.target.value)
              }
              className="
                h-11 rounded-xl
                border-border/60
                bg-background/80
              "
            />
          </div>
        </div>

        </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0 bg-background">
            <div
          className="
            sticky bottom-0 z-20
            flex justify-end gap-3

             border-border/50
            bg-background/90
            backdrop-blur-xl

        
          "
        >
          <Button
            variant="outline"
            onClick={onClose}
              disabled={loading}

            className="
              h-10 px-5
              rounded-xl
              border-border/60
            "
          >
            Cancel
          </Button>

          <Button
            onClick={sendingData}
              disabled={loading}

            className="
              h-10 px-5
              rounded-xl
              shadow-sm
            "
          >
            {/* {mode === "edit"
              ? "Edit Contact"
              : "Create Contact"} */}
                {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {mode === "edit" ? "Updating..." : "Creating..."}
    </>
  ) : (
    mode === "edit" ? "Edit Contact" : "Create Contact"
  )}

          </Button>
        </div>
      </div>
</div>
    </div>

)}
  </div>
);
 
};

export default NewContactDrawer;
  // <Sheet open={open} onOpenChange={onClose}>
  //   <SheetContent
  //     className="
  //       !w-[720px]
  //       !max-w-none
  //       overflow-y-auto
  //       border-l border-border/60

  //       bg-background/95
  //       backdrop-blur-xl

  //       p-0

  //       dark:bg-background/90
  //     "
  //   >
  //     {/* Header */}
  //     <div
  //       className="
  //         sticky top-0 z-20
  //         border-b border-border/50
  //         bg-background/90
  //         backdrop-blur-xl
  //       "
  //     >
  //       <SheetHeader className="px-6 py-5 space-y-1">
  //         <div className="flex items-center justify-between">
  //           <div className="space-y-1">
  //             <SheetTitle
  //               className="
  //                 text-lg font-semibold tracking-tight
  //                 text-foreground
  //               "
  //               style={{
  //                 fontFamily: "var(--font-family)",
  //                 fontSize:
  //                   "calc(1.05rem * var(--font-scale, 100) / 100)",
  //               }}
  //             >
  //               {mode === "edit"
  //                 ? "Edit Contact"
  //                 : "New Contact"}
  //             </SheetTitle>

  //             <p
  //               className="
  //                 text-sm text-muted-foreground
  //               "
  //               style={{
  //                 fontFamily: "var(--font-family)",
  //                 fontSize:
  //                   "calc(0.82rem * var(--font-scale, 100) / 100)",
  //               }}
  //             >
  //               Manage personal details, communication,
  //               tags and address information.
  //             </p>
  //           </div>

  //           <div
  //             className="
  //               h-10 w-10
  //               rounded-2xl
  //               border border-primary/20
  //               bg-primary/10
  //               flex items-center justify-center cursor-pointer
  //             "
  //             onClick={onClose}
  //           >
  //             <span className="text-sm font-semibold text-primary">
  //               {mode === "edit" ? "E" : "N"}
  //             </span>
  //           </div>
  //         </div>
  //       </SheetHeader>
  //     </div>

  //     {/* Body */}
      // <div className="px-6 py-5 space-y-6">
      //   {/* Name Section */}
      //   <div
      //     className="
      //       rounded-2xl
      //       border border-border/60
      //       bg-muted/20
      //       p-5
      //       space-y-4

      //       dark:bg-muted/10
      //     "
      //   >
      //     <div>
      //       <h3
      //         className="
      //           text-sm font-semibold
      //           text-foreground
      //         "
      //       >
      //         Personal Information
      //       </h3>

      //       <p className="text-xs text-muted-foreground mt-1">
      //         Basic contact identification details.
      //       </p>
      //     </div>

      //     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      //       <Input
      //         placeholder="First Name *"
      //         value={firstName}
      //         onChange={(e) =>
      //           setFirstName(e.target.value)
      //         }
      //         className="
      //           h-11 rounded-xl
      //           border-border/60
      //           bg-background/80
      //           focus-visible:ring-primary/20
      //         "
      //       />

      //       <Input
      //         placeholder="Middle Name"
      //         value={middleName}
      //         onChange={(e) =>
      //           setMiddleName(e.target.value)
      //         }
      //         className="
      //           h-11 rounded-xl
      //           border-border/60
      //           bg-background/80
      //         "
      //       />

      //       <Input
      //         placeholder="Last Name *"
      //         value={lastName}
      //         onChange={(e) =>
      //           setLastName(e.target.value)
      //         }
      //         className="
      //           h-11 rounded-xl
      //           border-border/60
      //           bg-background/80
      //         "
      //       />
      //     </div>

      //     <Input
      //       value={contactName}
      //       placeholder="Contact Name"
      //       onChange={(e) =>
      //         setContactName(e.target.value)
      //       }
      //       className="
      //         h-11 rounded-xl
      //         border-border/60
      //         bg-background/80
      //       "
      //     />

      //     <Input
      //       value={companyName}
      //       placeholder="Company Name"
      //       onChange={(e) =>
      //         setCompanyName(e.target.value)
      //       }
      //       className="
      //         h-11 rounded-xl
      //         border-border/60
      //         bg-background/80
      //       "
      //     />

      //     <Input
      //       value={email}
      //       placeholder="Email Address"
      //       onChange={(e) =>
      //         setEmail(e.target.value)
      //       }
      //       className="
      //         h-11 rounded-xl
      //         border-border/60
      //         bg-background/80
      //       "
      //     />
      //   </div>

      //   {/* Tags & Notes */}
      //   <div
      //     className="
      //       rounded-2xl
      //       border border-border/60
      //       bg-muted/20
      //       p-5
      //       space-y-4

      //       dark:bg-muted/10
      //     "
      //   >
      //     <div>
      //       <h3 className="text-sm font-semibold text-foreground">
      //         Additional Details
      //       </h3>

      //       <p className="text-xs text-muted-foreground mt-1">
      //         Organize contacts with tags and notes.
      //       </p>
      //     </div>

      //     <TagsMultiSelectDropDown
      //       value={selectedTags}
      //       onChange={handleTagChange}
      //       placeholder="Select tags"
      //     />

      //     <Textarea
      //       value={note}
      //       placeholder="Write a note..."
      //       onChange={(e) => setNote(e.target.value)}
      //       className="
      //         min-h-[110px]
      //         rounded-xl
      //         border-border/60
      //         bg-background/80
      //         resize-none
      //       "
      //     />

      //     <Input
      //       value={ssn}
      //       placeholder="SSN"
      //       onChange={handleSSNChange}
      //       className="
      //         h-11 rounded-xl
      //         border-border/60
      //         bg-background/80
      //       "
      //     />
      //   </div>

      //   {/* Phone Numbers */}
      //   <div
      //     className="
      //       rounded-2xl
      //       border border-border/60
      //       bg-muted/20
      //       p-5
      //       space-y-4

      //       dark:bg-muted/10
      //     "
      //   >
      //     <div className="flex items-center justify-between">
      //       <div>
      //         <h3 className="text-sm font-semibold text-foreground">
      //           Phone Numbers
      //         </h3>

      //         <p className="text-xs text-muted-foreground mt-1">
      //           Add one or multiple phone numbers.
      //         </p>
      //       </div>

      //       <button
      //         type="button"
      //         onClick={handleAddPhoneNumber}
      //         className="
      //           inline-flex items-center gap-1.5
      //           rounded-xl
      //           border border-primary/20
      //           bg-primary/10
      //           px-3 py-2

      //           text-xs font-medium text-primary

      //           transition-all duration-200
      //           hover:bg-primary/15
      //         "
      //       >
      //         <AiOutlinePlusCircle className="h-4 w-4" />
      //         Add Phone
      //       </button>
      //     </div>

      //     <div className="space-y-3">
      //       {phoneNumbers.map((phone) => (
      //         <div
      //           key={phone.id}
      //           className="flex items-center gap-2"
      //         >
      //           <div className="flex-1 min-w-0">
      //             <PhoneInput
      //               country="us"
      //               value={phone.phone}
      //               onChange={(val) =>
      //                 setPhoneNumbers((prev) =>
      //                   prev.map((p) =>
      //                     p.id === phone.id
      //                       ? {
      //                           ...p,
      //                           phone: val,
      //                         }
      //                       : p
      //                   )
      //                 )
      //               }
      //               inputStyle={{
      //                 width: "100%",
      //                 height: "44px",
      //                 fontSize: "14px",
      //                 borderRadius: "12px",
      //                 border: "1px solid hsl(var(--border))",
      //                 background: "hsl(var(--background))",
      //                 color: "hsl(var(--foreground))",
      //               }}
      //               buttonStyle={{
      //                 borderTopLeftRadius: "12px",
      //                 borderBottomLeftRadius: "12px",
      //                 borderColor:
      //                   "hsl(var(--border))",
      //                 background:
      //                   "hsl(var(--background))",
      //               }}
      //               containerStyle={{
      //                 width: "100%",
      //               }}
      //             />
      //           </div>

      //           <button
      //             type="button"
      //             onClick={() =>
      //               handleDeletePhoneNumber(phone.id)
      //             }
      //             className="
      //               inline-flex
      //               h-11 w-11
      //               items-center justify-center

      //               rounded-xl

      //               border border-border/60
      //               bg-background/70

      //               text-muted-foreground
      //               transition-all duration-200

      //               hover:border-destructive/20
      //               hover:bg-destructive/10
      //               hover:text-destructive
      //             "
      //           >
      //             <AiOutlineDelete className="h-4 w-4" />
      //           </button>
      //         </div>
      //       ))}
      //     </div>
      //   </div>

      //   {/* Address */}
      //   <div
      //     className="
      //       rounded-2xl
      //       border border-border/60
      //       bg-muted/20
      //       p-5
      //       space-y-4

      //       dark:bg-muted/10
      //     "
      //   >
      //     <div>
      //       <h3 className="text-sm font-semibold text-foreground">
      //         Address Information
      //       </h3>

      //       <p className="text-xs text-muted-foreground mt-1">
      //         Contact mailing and regional details.
      //       </p>
      //     </div>

      //     <Popover>
      //       <PopoverTrigger asChild>
      //         <Button
      //           variant="outline"
      //           className="
      //             w-full h-11
      //             justify-between

      //             rounded-xl
      //             border-border/60
      //             bg-background/80

      //             font-normal
      //             text-muted-foreground

      //             hover:bg-muted/30
      //           "
      //         >
      //           {selectedCountry?.label ||
      //             "Select Country"}
      //         </Button>
      //       </PopoverTrigger>

      //       <PopoverContent
      //         className="
      //           w-[var(--radix-popover-trigger-width)]
      //           rounded-2xl
      //           border border-border/60
      //           p-0
      //           shadow-xl
      //         "
      //       >
      //         <Command className="rounded-2xl">
      //           <CommandInput
      //             placeholder="Search country..."
      //           />

      //           <CommandList>
      //             {options.map((opt) => (
      //               <CommandItem
      //                 key={opt.value}
      //                 onSelect={() =>
      //                   setSelectedCountry(opt)
      //                 }
      //                 className="cursor-pointer"
      //               >
      //                 {opt.label}
      //               </CommandItem>
      //             ))}
      //           </CommandList>
      //         </Command>
      //       </PopoverContent>
      //     </Popover>

      //     <Input
      //       placeholder="Street Address"
      //       value={streetAddress}
      //       onChange={(e) =>
      //         setStreetAddress(e.target.value)
      //       }
      //       className="
      //         h-11 rounded-xl
      //         border-border/60
      //         bg-background/80
      //       "
      //     />

      //     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      //       <Input
      //         placeholder="City"
      //         value={city}
      //         onChange={(e) =>
      //           setCity(e.target.value)
      //         }
      //         className="
      //           h-11 rounded-xl
      //           border-border/60
      //           bg-background/80
      //         "
      //       />

      //       <Input
      //         placeholder="State"
      //         value={state}
      //         onChange={(e) =>
      //           setState(e.target.value)
      //         }
      //         className="
      //           h-11 rounded-xl
      //           border-border/60
      //           bg-background/80
      //         "
      //       />

      //       <Input
      //         placeholder="Postal Code"
      //         value={postalCode}
      //         onChange={(e) =>
      //           setPostalCode(e.target.value)
      //         }
      //         className="
      //           h-11 rounded-xl
      //           border-border/60
      //           bg-background/80
      //         "
      //       />
      //     </div>
      //   </div>

  //       {/* Footer Buttons */}
  //       <div
  //         className="
  //           sticky bottom-0 z-20
  //           flex justify-end gap-3

  //           border-t border-border/50
  //           bg-background/90
  //           backdrop-blur-xl

  //           px-1 pt-5 pb-1
  //         "
  //       >
  //         <Button
  //           variant="outline"
  //           onClick={onClose}
  //           className="
  //             h-10 px-5
  //             rounded-xl
  //             border-border/60
  //           "
  //         >
  //           Cancel
  //         </Button>

  //         <Button
  //           onClick={sendingData}
  //           className="
  //             h-10 px-5
  //             rounded-xl
  //             shadow-sm
  //           "
  //         >
  //           {mode === "edit"
  //             ? "Edit Contact"
  //             : "Create Contact"}
  //         </Button>
  //       </div>
  //     </div>
  //   </SheetContent>
  // </Sheet>
// <Drawer
//   anchor="right"
//   open={open}
//   onClose={onClose}
//   PaperProps={{ sx: { width: 700, maxWidth: "100vw" } }}
// >
//   <Box
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       px: 3,
//       py: 2,
//       borderBottom: "1px solid",
//       borderColor: "divider",
//       bgcolor: "background.paper",
//     }}
//   >
//     <Typography variant="h6">
//       {mode === "edit" ? "Edit Contact" : "New Contact"}
//     </Typography>

//     <IconButton
//       onClick={onClose}
//       sx={{
//         borderRadius: 2,
//         "&:hover": {
//           bgcolor: "grey.100",
//         },
//       }}
//     >
//       <CloseIcon />
//     </IconButton>
//   </Box>
//   <Box>
//     <Box
//       component="form"
//       sx={{
//         px: "3%",
//         height: "90vh",
//         overflowY: "auto",
//       }}
//     >
//       {/* Name Fields */}
//       <Box m={2}>
//         <Grid
//           container
//           rowSpacing={3}
//           columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//         >
//           <Grid size={{ xs: 12, md: 4 }}>
//             <TextField
//               fullWidth
//               name="firstName"
//               value={firstName}
//               label="First Name *"
//               placeholder="First Name *"
//               size="small"
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setFirstName(value);
//                 if (value.trim() !== "") setFirstNameError("");
//               }}
//               error={!!firstNameError}
//             />

//             {firstNameError && (
//               <Alert
//                 variant="filled"
//                 severity="error"
//                 sx={{
//                   mt: 0.5,
//                   fontSize: "11px",
//                   borderRadius: "10px",
//                   height: "23px",
//                   display: "flex",
//                   alignItems: "center",
//                   "& .MuiAlert-icon": { fontSize: "16px", mr: 1 },
//                 }}
//               >
//                 {firstNameError}
//               </Alert>
//             )}
//           </Grid>

//           <Grid size={{ xs: 12, md: 4 }}>
//             <TextField
//               fullWidth
//               name="middleName"
//               value={middleName}
//               label="Middle Name"
//               placeholder="Middle Name"
//               size="small"
//               onChange={(e) => setMiddleName(e.target.value)}
//             />
//           </Grid>

//           <Grid size={{ xs: 12, md: 4 }}>
//             <TextField
//               fullWidth
//               name="lastName"
//               value={lastName}
//               label="Last Name *"
//               placeholder="Last Name *"
//               size="small"
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setLastName(value);
//                 if (value.trim() !== "") setLastNameError("");
//               }}
//               error={!!lastNameError}
//             />
//             {lastNameError && (
//               <Alert
//                 variant="filled"
//                 severity="error"
//                 sx={{
//                   mt: 0.5,
//                   fontSize: "11px",
//                   borderRadius: "10px",
//                   height: "23px",
//                   display: "flex",
//                   alignItems: "center",
//                   "& .MuiAlert-icon": { fontSize: "16px", mr: 1 },
//                 }}
//               >
//                 {lastNameError}
//               </Alert>
//             )}
//           </Grid>
//         </Grid>
//       </Box>
//       {/* Contact & Company */}
//       <Stack spacing={2} m={2}>
//         <Box>
//           <TextField
//             fullWidth
//             name="contactName"
//             label="Contact Name"
//             value={contactName}
//             placeholder="Contact Name"
//             size="small"
//             onChange={(e) => setContactName(e.target.value)}
//           />
//         </Box>

//         <Box>
//           <TextField
//             fullWidth
//             name="companyName"
//             label="Company Name"
//             value={companyName}
//             placeholder="Company Name"
//             size="small"
//             onChange={(e) => setCompanyName(e.target.value)}
//           />
//         </Box>

//         {/* Email */}
//         <Box>
//           <TextField
//             fullWidth
//             name="email"
//             value={email}
//             placeholder="Email *"
//             label="Email *"
//             size="small"
//             onChange={(e) => setEmail(e.target.value)}
//             error={!!emailError}
//           />
//           {emailError && (
//             <Alert
//               variant="filled"
//               severity="error"
//               sx={{
//                 mt: 0.5,
//                 fontSize: "11px",
//                 borderRadius: "10px",
//                 height: "23px",
//                 display: "flex",
//                 alignItems: "center",
//                 "& .MuiAlert-icon": { fontSize: "16px", mr: 1 },
//               }}
//             >
//               {emailError}
//             </Alert>
//           )}
//         </Box>
//       </Stack>

//       {/* Tags & Note */}
//       <Stack spacing={2} m={2}>
//         <Box>
// <TagsMultiSelectDropDown
//   value={selectedTags}
//   onChange={handleTagChange}
//   placeholder="Tags"
// />
//         </Box>

//         <Box>
//           <TextField
//             fullWidth
//             name="note"
//             multiline
//             size="small"
//             placeholder="Note"
//             label="Note"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//           />
//         </Box>

//         {/* SSN */}
//         <Box>
//           <TextField
//             fullWidth
//             name="ssn"
//             value={ssn}
//             placeholder="123-45-6789"
//             size="small"
//             label="SSN"
//             onChange={handleSSNChange}
//             error={!!ssnError}
//             helperText={ssnError || "Format: 123-45-6789"}
//             inputProps={{
//               maxLength: 11,
//               inputMode: "numeric",
//               pattern: "[0-9]*",
//             }}
//           />
//         </Box>
//       </Stack>

//       {/* Phone Numbers */}
//       <Typography variant="h6" mt={3} m={2} fontWeight="bold">
//         Phone Numbers
//       </Typography>
//       <Stack spacing={2} m={2}>
//         {phoneNumbers.map((phone) => (
//           <Box key={phone.id} sx={{ position: "relative" }}>
//             {phone.isPrimary && (
//               <Chip
//                 label="Primary phone"
//                 color="primary"
//                 size="small"
//                 sx={{ position: "absolute", top: -20, left: 0 }}
//               />
//             )}
//             <Box display="flex" alignItems="center" gap={2}>
//               <PhoneInput
//                 country="us"
//                 value={phone.phone}
//                 onChange={(value, country) =>
//                   handlePhoneNumberChange(value, country, phone.id)
//                 }
//                 inputStyle={{ width: "100%" }}
//                 buttonStyle={{
//                   borderTopLeftRadius: 8,
//                   borderBottomLeftRadius: 8,
//                 }}
//                 containerStyle={{ display: "flex", flex: 1 }}
//               />
//               <AiOutlineDelete
//                 style={{ cursor: "pointer", color: "red" }}
//                 onClick={() => handleDeletePhoneNumber(phone.id)}
//               />
//             </Box>
//           </Box>
//         ))}

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 1,
//             color: "blue",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//           onClick={handleAddPhoneNumber}
//         >
//           <AiOutlinePlusCircle />
//           <Typography>Add phone number</Typography>
//         </Box>
//       </Stack>

//       {/* Address */}
//       <Typography variant="h6" m={2} fontWeight="bold">
//         Address
//       </Typography>
//       <Stack spacing={2} m={2}>
//         <Autocomplete
//           options={options}
//           getOptionLabel={(option) => option.label}
//           value={selectedCountry}
//           onChange={(e, newVal) => setSelectedCountry(newVal)}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Select Country"
//               size="small"
//             />
//           )}
//         />
//         <TextField
//           fullWidth
//           name="streetAddress"
//           value={streetAddress}
//           onChange={(e) => setStreetAddress(e.target.value)}
//           placeholder="Street address"
//           size="small"
//           label="Street Address"
//         />
//       </Stack>
//       <Box m={2}>
//         <Grid
//           container
//           rowSpacing={3}
//           columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//         >
//           <Grid size={{ xs: 12, md: 4 }}>
//             {" "}
//             <TextField
//               fullWidth
//               name="city"
//               value={city}
//               placeholder="City"
//               label="City"
//               size="small"
//               onChange={(e) => setCity(e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 12, md: 4 }}>
//             <TextField
//               fullWidth
//               name="state"
//               value={state}
//               label="State/Province"
//               placeholder="State/Province"
//               size="small"
//               onChange={(e) => setState(e.target.value)}
//             />
//           </Grid>
//           <Grid size={{ xs: 12, md: 4 }}>
//             <TextField
//               fullWidth
//               name="postalCode"
//               value={postalCode}
//               placeholder="ZIP/Postal Code"
//               label="ZIP/Postal Code"
//               size="small"
//               onChange={(e) => setPostalCode(e.target.value)}
//             />
//           </Grid>
//         </Grid>
//       </Box>
//       {/* Buttons */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "flex-end",
//           gap: 2,
//           mt: 4,
//           mb: 2,
//         }}
//       >
//         <Button variant="contained" onClick={sendingData}>
//           {/* Create */}
//            {mode === "edit" ? "Edit Contact" : "Create Contact"}
//         </Button>
//         <Button variant="outlined" onClick={onClose}>
//           Cancel
//         </Button>
//       </Box>
//     </Box>
//   </Box>
// </Drawer>
