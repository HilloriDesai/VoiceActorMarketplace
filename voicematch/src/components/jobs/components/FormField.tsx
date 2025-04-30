import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaExclamationCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
