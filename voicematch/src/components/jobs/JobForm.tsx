import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { createJob, uploadScript } from "@/lib/api";
import Button from "../ui/Button";
import { NewJobInput } from "@/types";

interface JobFormProps {
  actorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JobForm({ actorId, onClose, onSuccess }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewJobInput>();

  const onSubmit = async (data: NewJobInput) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      let scriptUrl = "";
      if (scriptFile) {
        const fileName = `${uuidv4()}-${scriptFile.name}`;
        scriptUrl = await uploadScript(scriptFile, fileName);
      }

      const characterTraits = Array.isArray(data.character_traits)
        ? data.character_traits
            .map((trait: string) => trait.trim())
            .filter(Boolean)
        : [];

      const result = await createJob({
        project_name: data.project_name,
        actor_id: actorId,
        category: data.category,
        character_traits: characterTraits,
        language: data.language || "",
        accent: data.accent || "",
        voice_gender: data.voice_gender,
        script_url: scriptUrl,
        estimated_length_minutes: data.estimated_length_minutes || 0,
        deadline: data.deadline,
        budget: data.budget || 0,
        approval_process: data.approval_process || "",
      });

      if (result.success) {
        onSuccess();
      } else {
        setSubmitError(result.errors.join(". "));
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScriptFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{submitError}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          {...register("project_name", {
            required: "Project name is required",
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.project_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.project_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          {...register("category", {
            required: "Category is required",
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select category</option>
          <option value="Animation">Animation</option>
          <option value="Commercials">Commercials</option>
          <option value="Audiobooks">Audiobooks</option>
          <option value="E-Learning">E-Learning</option>
          <option value="Podcasts">Podcasts</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Character Traits (comma separated)
        </label>
        <input
          type="text"
          {...register("character_traits", {
            setValueAs: (value: string) =>
              value
                ? value
                    .split(",")
                    .map((trait) => trait.trim())
                    .filter(Boolean)
                : [],
          })}
          placeholder="e.g., Warm, Authoritative, Energetic"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <input
            type="text"
            {...register("language")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Accent
          </label>
          <input
            type="text"
            {...register("accent")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Voice Gender
        </label>
        <select
          {...register("voice_gender", {
            required: "Voice gender is required",
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Any">Any</option>
        </select>
        {errors.voice_gender && (
          <p className="mt-1 text-sm text-red-600">
            {errors.voice_gender.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Script File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estimated Length (minutes)
          </label>
          <input
            type="number"
            {...register("estimated_length_minutes", {
              valueAsNumber: true,
              required: "Estimated length is required",
              min: {
                value: 1,
                message: "Length must be at least 1 minute",
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.estimated_length_minutes && (
            <p className="mt-1 text-sm text-red-600">
              {errors.estimated_length_minutes.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="date"
            {...register("deadline", {
              required: "Deadline is required",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.deadline && (
            <p className="mt-1 text-sm text-red-600">
              {errors.deadline.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Budget ($)
        </label>
        <input
          type="number"
          {...register("budget", {
            valueAsNumber: true,
            required: "Budget is required",
            min: {
              value: 1,
              message: "Budget must be greater than 0",
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.budget && (
          <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Approval Steps
        </label>
        <textarea
          {...register("approval_process", {
            required: "Approval process is required",
          })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe your approval process..."
        />
        {errors.approval_process && (
          <p className="mt-1 text-sm text-red-600">
            {errors.approval_process.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Job Invitation"}
        </Button>
      </div>
    </form>
  );
}
