import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { VoiceActor, ReplyTime } from "@/types";
import { createActor } from "@/lib/api";
import { FaMusic, FaTimes, FaCheck, FaExclamationCircle } from "react-icons/fa";
interface ActorFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

type NewActorInput = Omit<
  VoiceActor,
  | "id"
  | "rating"
  | "review_count"
  | "last_online"
  | "last_hired"
  | "completed_jobs"
>;

export default function ActorForm({ onClose, onSuccess }: ActorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [audioFiles, setAudioFiles] = useState<{ file: File; title: string }[]>(
    []
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewActorInput>();

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleAudioFileAdd = () => {
    setAudioFiles([...audioFiles, { file: new File([], ""), title: "" }]);
  };

  const handleAudioFileChange = (index: number, file: File) => {
    const newAudioFiles = [...audioFiles];
    newAudioFiles[index] = { ...newAudioFiles[index], file };
    setAudioFiles(newAudioFiles);
  };

  const handleAudioTitleChange = (index: number, title: string) => {
    const newAudioFiles = [...audioFiles];
    newAudioFiles[index] = { ...newAudioFiles[index], title };
    setAudioFiles(newAudioFiles);
  };

  const onSubmit = async (data: NewActorInput) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      console.log("Form data:", data);

      // Filter out audio files that haven't been fully filled out
      const validAudioFiles = audioFiles.filter(
        (audio) => audio.file.size > 0 && audio.title.trim()
      );

      console.log("Valid audio files:", validAudioFiles);

      const actorData = {
        ...data,
        certifications: data.certifications || [],
        past_clients: data.past_clients || [],
        audio_samples: [], // This will be replaced by the uploaded files
        typical_reply_time: data.typical_reply_time as ReplyTime,
        profile_picture_url: "", // This will be set by the API if a picture is uploaded
      };

      console.log("Actor data being sent:", actorData);

      const result = await createActor(
        actorData,
        profilePicture || undefined,
        validAudioFiles
      );

      console.log("Create actor result:", result);

      if (result.success) {
        setSubmitSuccess(true);
        // Wait a moment to show the success message before redirecting
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setSubmitError(result.errors.join(". "));
      }
    } catch (error) {
      console.error("Error submitting actor:", error);
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Animation",
    "Commercials",
    "Audiobooks",
    "E-Learning",
    "Podcasts",
  ];

  const replyTimes: ReplyTime[] = ["<1 hour", "1-2 hours", "1 day", "2+ days"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <FaExclamationCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-red-700">{submitError}</p>
        </div>
      )}

      {submitSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <FaCheck className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-green-700">
            Voice actor profile created successfully!
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-violet-300 flex items-center justify-center bg-violet-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm text-gray-500">
              {profilePicture
                ? profilePicture.name
                : "Click to upload a profile picture"}
            </div>
          </div>
        </div>

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
            Categories
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
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
                  className="absolute opacity-0"
                />
                <span className="text-sm text-gray-700">{category}</span>
                <div className="ml-auto w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center group-checked:bg-violet-500 group-checked:border-violet-500">
                  <FaCheck className="w-3 h-3 text-white opacity-0 group-checked:opacity-100" />
                </div>
              </label>
            ))}
          </div>
          {errors.categories && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <FaExclamationCircle className="w-4 h-4 mr-1" />
              {errors.categories.message}
            </p>
          )}
        </div>

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
                    onChange={(e) =>
                      handleAudioTitleChange(index, e.target.value)
                    }
                    className="flex-1 px-3 py-1.5 rounded-md border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors mr-3"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newAudioFiles = [...audioFiles];
                      newAudioFiles.splice(index, 1);
                      setAudioFiles(newAudioFiles);
                    }}
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
                          handleAudioFileChange(index, e.target.files[0]);
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
              onClick={handleAudioFileAdd}
              className="w-full py-3 border-2 border-dashed border-violet-300 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors flex items-center justify-center space-x-2"
            >
              <FaMusic className="w-4 h-4" />
              <span>Add Audio Sample</span>
            </button>
          </div>
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
            Typical Reply Time
          </label>
          <select
            {...register("typical_reply_time", {
              required: "Reply time is required",
            })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-colors"
          >
            <option value="">Select reply time</option>
            {replyTimes.map((time) => (
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

        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? "Creating..." : "Create Profile"}
          </Button>
        </div>
      </div>
    </form>
  );
}
