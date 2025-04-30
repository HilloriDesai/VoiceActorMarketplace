import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { createJob, uploadScript } from "@/lib/apis";
import { NewJobInput } from "@/types";
import FormField from "./components/FormField";
import ScriptUpload from "./components/ScriptUpload";
import FormStatus from "./components/FormStatus";
import FormActions from "./components/FormActions";

interface JobFormProps {
  actorId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  "Animation",
  "Commercials",
  "Audiobooks",
  "E-Learning",
  "Podcasts",
];

export default function JobForm({ actorId, onClose, onSuccess }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewJobInput>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScriptFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: NewJobInput) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

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
        setSubmitSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormStatus error={submitError} success={submitSuccess} />

      <div className="space-y-6">
        <FormField label="Project Name" error={errors.project_name?.message}>
          <input
            type="text"
            {...register("project_name", {
              required: "Project name is required",
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            placeholder="Enter your project name"
          />
        </FormField>

        <FormField label="Category" error={errors.category?.message}>
          <select
            {...register("category", {
              required: "Category is required",
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Character Traits">
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
            placeholder="e.g., Warm, Authoritative, Energetic (comma-separated)"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Language">
            <input
              type="text"
              {...register("language")}
              placeholder="e.g., English"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            />
          </FormField>

          <FormField label="Accent">
            <input
              type="text"
              {...register("accent")}
              placeholder="e.g., American"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            />
          </FormField>
        </div>

        <FormField label="Voice Gender" error={errors.voice_gender?.message}>
          <select
            {...register("voice_gender", {
              required: "Voice gender is required",
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
          >
            <option value="">Select voice gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Any">Any</option>
          </select>
        </FormField>

        <ScriptUpload scriptFile={scriptFile} onChange={handleFileChange} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Estimated Length (minutes)"
            error={errors.estimated_length_minutes?.message}
          >
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            />
          </FormField>

          <FormField label="Deadline" error={errors.deadline?.message}>
            <input
              type="date"
              {...register("deadline", {
                required: "Deadline is required",
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            />
          </FormField>
        </div>

        <FormField label="Budget ($)" error={errors.budget?.message}>
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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            placeholder="Enter budget in USD"
          />
        </FormField>

        <FormField
          label="Approval Process"
          error={errors.approval_process?.message}
        >
          <textarea
            {...register("approval_process", {
              required: "Approval process is required",
            })}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
            placeholder="Describe your approval process and requirements..."
          />
        </FormField>

        <FormActions onClose={onClose} isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
