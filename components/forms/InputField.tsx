"use client";

import { useState } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: "text" | "textarea" | "select";
  placeholder?: string;
  help?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  maxLength?: number;
}

export function InputField({
  id,
  label,
  type = "text",
  placeholder,
  help,
  required,
  value,
  onChange,
  options,
  maxLength,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    backgroundColor: 'var(--nx-bg-input)',
    borderColor: focused ? 'var(--nx-border-focus)' : 'var(--nx-border)',
    color: 'var(--nx-text)',
    boxShadow: focused ? '0 0 0 3px var(--nx-accent-glow)' : 'none',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="nx-label flex items-center gap-2">
          {label}
          {required && <span style={{ color: 'var(--nx-accent)' }}>*</span>}
        </label>
        {maxLength && type === "textarea" && (
          <span 
            className="text-xs font-mono"
            style={{ color: value.length > maxLength ? 'var(--nx-error)' : 'var(--nx-text-dim)' }}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={4}
          className="nx-input"
          style={inputStyle}
        />
      ) : type === "select" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="nx-input cursor-pointer"
          style={inputStyle}
        >
          <option value="" disabled>Select an option...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="nx-input"
          style={inputStyle}
        />
      )}

      {help && (
        <p className="text-xs pl-1" style={{ color: 'var(--nx-text-dim)' }}>
          {help}
        </p>
      )}
    </div>
  );
}
