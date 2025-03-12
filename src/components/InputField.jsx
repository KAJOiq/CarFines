import React from "react";
const InputField = ({ label, name, value, onChange, disabled, className }) => {
  return (
    <div className="flex flex-col">
      <label className="text-right font-medium mb-1">{label}</label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded px-3 py-2 ${className}`}
      />
    </div>
  );
};

export default InputField;