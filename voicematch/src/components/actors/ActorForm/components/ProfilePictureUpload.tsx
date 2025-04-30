import React from "react";

interface ProfilePictureUploadProps {
  onFileChange: (file: File) => void;
  currentFile: File | null;
}

export function ProfilePictureUpload({
  onFileChange,
  currentFile,
}: ProfilePictureUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Profile Picture
      </label>
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-violet-300 flex items-center justify-center bg-violet-50">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="text-sm text-gray-500">
          {currentFile ? currentFile.name : "Click to upload a profile picture"}
        </div>
      </div>
    </div>
  );
}
