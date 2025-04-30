import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { NewActorInput, REPLY_TIMES } from "./types";

interface BasicInformationProps {
  register: UseFormRegister<NewActorInput>;
  errors: FieldErrors<NewActorInput>;
}

export function BasicInformation({ register, errors }: BasicInformationProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
          placeholder="Your professional name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="w-4 h-4 mr-1" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          {...register("location", { required: "Location is required" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
          placeholder="City, Country"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="w-4 h-4 mr-1" />
            {errors.location.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          {...register("bio", { required: "Bio is required" })}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
          placeholder="Tell clients about your experience and expertise..."
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="w-4 h-4 mr-1" />
            {errors.bio.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Typical Reply Time
        </label>
        <select
          {...register("typical_reply_time", {
            required: "Reply time is required",
          })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
        >
          <option value="">Select reply time</option>
          {REPLY_TIMES.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {errors.typical_reply_time && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <FaExclamationCircle className="w-4 h-4 mr-1" />
            {errors.typical_reply_time.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Certifications
        </label>
        <input
          type="text"
          {...register("certifications", {
            setValueAs: (value: string) =>
              value
                ? value
                    .split(",")
                    .map((cert) => cert.trim())
                    .filter(Boolean)
                : [],
          })}
          placeholder="Enter certifications (comma-separated)"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Past Clients
        </label>
        <input
          type="text"
          {...register("past_clients", {
            setValueAs: (value: string) =>
              value
                ? value
                    .split(",")
                    .map((client) => client.trim())
                    .filter(Boolean)
                : [],
          })}
          placeholder="Enter past clients (comma-separated)"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
        />
      </div>
    </>
  );
}
