import React from "react";
import { FaMusic, FaTimes } from "react-icons/fa";
import { AudioFile } from "./types";

interface AudioSamplesUploadProps {
  audioFiles: AudioFile[];
  onAudioFileAdd: () => void;
  onAudioFileChange: (index: number, file: File) => void;
  onAudioTitleChange: (index: number, title: string) => void;
  onAudioFileRemove: (index: number) => void;
}

export function AudioSamplesUpload({
  audioFiles,
  onAudioFileAdd,
  onAudioFileChange,
  onAudioTitleChange,
  onAudioFileRemove,
}: AudioSamplesUploadProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Audio Samples
      </label>
      <div className="space-y-4">
        {audioFiles.map((audio, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Sample title"
                value={audio.title}
                onChange={(e) => onAudioTitleChange(index, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-md border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors mr-3"
              />
              <button
                type="button"
                onClick={() => onAudioFileRemove(index)}
                className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative rounded-md border-2 border-dashed border-gray-300 p-4 flex items-center justify-center bg-white">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onAudioFileChange(index, e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <FaMusic className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-500">
                    {audio.file.name || "Click to upload audio"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAudioFileAdd}
          className="w-full py-3 border-2 border-dashed border-violet-300 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors flex items-center justify-center space-x-2"
        >
          <FaMusic className="w-4 h-4" />
          <span>Add Audio Sample</span>
        </button>
      </div>
    </div>
  );
}
