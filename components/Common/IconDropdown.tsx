import { useState } from "react";
import { availableIcons } from "./AvailableIcons";

export default function IconDropdown({ value, onChange }: any) {
  const [open, setOpen] = useState(false);

  const handleSelect = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Tombol utama */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border rounded-lg p-3 text-left flex items-center justify-between"
      >
        <span>{value || "Pilih Icon"}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border rounded shadow mt-1 z-10 max-h-60 overflow-auto">
          {availableIcons.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
