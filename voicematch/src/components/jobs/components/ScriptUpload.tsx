import React from "react";
import { FaFileUpload } from "react-icons/fa";
import FormField from "./FormField";

interface ScriptUploadProps {
  scriptFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ScriptUpload({
  scriptFile,
  onChange,
}: ScriptUploadProps) {
  return (
    <FormField label="Script File">
      <div className="relative rounded-lg border-2 border-dashed border-violet-300 p-6 flex flex-col items-center justify-center bg-violet-50">
        <input
          type="file"
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <FaFileUpload className="w-8 h-8 text-violet-400 mb-2" />
        <div className="text-sm text-gray-500">
          {scriptFile ? scriptFile.name : "Click to upload script file"}
        </div>
      </div>
    </FormField>
  );
}
