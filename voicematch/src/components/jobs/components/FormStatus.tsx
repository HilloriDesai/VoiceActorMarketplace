import React from "react";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";

interface FormStatusProps {
  error?: string | null;
  success?: boolean;
}

export default function FormStatus({ error, success }: FormStatusProps) {
  if (!error && !success) return null;

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
        <FaExclamationCircle className="w-5 h-5 text-red-500 mr-3" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
        <FaCheck className="w-5 h-5 text-green-500 mr-3" />
        <p className="text-green-700">Job invitation sent successfully!</p>
      </div>
    );
  }

  return null;
}
