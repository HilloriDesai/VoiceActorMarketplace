import React from "react";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { NewActorInput, CATEGORIES } from "./types";

interface CategorySelectionProps {
  register: UseFormRegister<NewActorInput>;
  error?: FieldErrors<NewActorInput>["categories"];
}

export function CategorySelection({ register, error }: CategorySelectionProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Categories
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CATEGORIES.map((category) => (
          <label
            key={category}
            className="relative flex items-center p-3 rounded-lg border border-gray-200 hover:border-violet-500 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              {...register("categories", {
                required: "At least one category is required",
                validate: (value) =>
                  (value && value.length >= 1 && value.length <= 5) ||
                  "Please select between 1 and 5 categories",
              })}
              value={category}
              className="absolute opacity-0 peer"
            />
            <span className="text-sm text-gray-700">{category}</span>
            <div className="ml-auto w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center peer-checked:bg-violet-500 peer-checked:border-violet-500">
              <FaCheck className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <FaExclamationCircle className="w-4 h-4 mr-1" />
          {error.message}
        </p>
      )}
    </div>
  );
}
