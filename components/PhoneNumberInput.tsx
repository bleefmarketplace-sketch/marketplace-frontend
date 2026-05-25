"use client";

import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
 

interface PhoneNumberInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  defaultCountry?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  label,
  value,
  onChange,
  error,
  defaultCountry = "NG",
}) => {
  return (
    <div className="w-full font-mono text-xs">
      {label && (
        <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
          {label}
        </label>
      )}

      <div
        className={`
          relative flex items-center
          rounded-none border bg-white px-3 py-2.5
          ${error ? "border-red-600" : "border-zinc-300"}
          focus-within:border-green-700
          focus-within:ring-0
        `}
      >
        <PhoneInput
          international
          defaultCountry={defaultCountry as any}
          value={value}
          onChange={(val) => onChange(val || "")}
          className="w-full text-xs font-mono bg-transparent outline-none border-none focus:outline-none"
        />
      </div>

      {error && <p className="mt-1 text-[10px] font-bold text-red-600 uppercase ml-1">{error}</p>}
    </div>
  );
};