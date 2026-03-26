import { useState, useEffect, useRef } from "react";

const useShortcuts = () => {
  const [showShortcutDropdown, setShowShortcutDropdown] = useState(false);
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [switchfilteredShortcuts, setSwitchFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [description, setDescription] = useState("");
  const [clientmsg, setClientmsg] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [anchorElShortcut, setAnchorElShortcut] = useState(null);
  const [switchanchorEl, setSwitchAnchorEl] = useState(null);
  const textFieldRef = useRef(null);

  const contactShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
    { title: "Contact Shortcodes", isBold: true },
    { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
    { title: "First Name", isBold: false, value: "FIRST_NAME" },
    { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
    { title: "Last Name", isBold: false, value: "LAST_NAME" },
    { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
    { title: "Country", isBold: false, value: "COUNTRY" },
    { title: "Company name", isBold: false, value: "COMPANY_NAME" },
    { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
    { title: "City", isBold: false, value: "CITY" },
    { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
    { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
    { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
    { title: "Date Shortcodes", isBold: true },
    { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
    { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
    { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
    { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
    { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
    { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
    { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
    { title: "Last week", isBold: false, value: "LAST_WEEK" },
    { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
    { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
    { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
    { title: "Last_year", isBold: false, value: "LAST_YEAR" },
    { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
    { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
    { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
    { title: "Next week", isBold: false, value: "NEXT_WEEK" },
    { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
    { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
    { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
    { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  ];

  const accountShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
    { title: "Date Shortcodes", isBold: true },
    { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
    { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
    { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
    { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
    { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
    { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
    { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
    { title: "Last week", isBold: false, value: "LAST_WEEK" },
    { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
    { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
    { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
    { title: "Last_year", isBold: false, value: "LAST_YEAR" },
    { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
    { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
    { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
    { title: "Next week", isBold: false, value: "NEXT_WEEK" },
    { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
    { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
    { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
    { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  ];

  useEffect(() => {
    setShortcuts(selectedOption === "contacts" ? contactShortcuts : accountShortcuts);
  }, [selectedOption]);

  useEffect(() => {
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
    setSwitchFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  const handleDescriptions = (e) => {
    const { value, selectionStart } = e.target;
    setDescription(value);
    setCursorPosition(selectionStart);
  };

  const toggleShortcutDropdown = (event) => {
    setAnchorElShortcut(event.currentTarget);
    setShowShortcutDropdown(!showShortcutDropdown);
  };

  const toggleSwitchDropdown = (event) => {
    setSwitchAnchorEl(event.currentTarget);
    setShowSwitchDropdown(!showSwitchDropdown);
  };

  const handleCloseShortcutDropdown = () => {
    setAnchorElShortcut(null);
    setShowShortcutDropdown(false);
  };

  const handleCloseSwitchDropdown = () => {
    setSwitchAnchorEl(null);
    setShowSwitchDropdown(false);
  };

  const handleAddShortcut = (shortcut) => {
    setDescription((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText;
    });

    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2,
        );
      }
    }, 0);

    setShowShortcutDropdown(false);
  };

  const handleSwitchAddShortcut = (shortcut) => {
    setClientmsg((prevText) => prevText + `[${shortcut}]`);
    setShowSwitchDropdown(false);
  };

  return {
    shortcuts,
    selectedOption,
    setSelectedOption,
    description,
    setDescription,
    clientmsg,
    setClientmsg,
    showShortcutDropdown,
    showSwitchDropdown,
    anchorElShortcut,
    switchanchorEl,
    filteredShortcuts,
    switchfilteredShortcuts,
    textFieldRef,
    cursorPosition,
    handleDescriptions,
    toggleShortcutDropdown,
    toggleSwitchDropdown,
    handleCloseShortcutDropdown,
    handleCloseSwitchDropdown,
    handleAddShortcut,
    handleSwitchAddShortcut,
  };
};

export default useShortcuts;