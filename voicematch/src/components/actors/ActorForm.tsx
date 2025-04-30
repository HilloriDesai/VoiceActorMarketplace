import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { VoiceActor, ReplyTime } from "@/types";
import { createActor } from "@/lib/api";

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

      // Filter out audio files that haven't been fully filled out
      const validAudioFiles = audioFiles.filter(
        (audio) => audio.file.size > 0 && audio.title.trim()
      );

      await createActor(
        {
          ...data,
          description: data.bio,
          certifications: data.certifications || [],
          past_clients: data.past_clients || [],
          audio_samples: [], // This will be replaced by the uploaded files
          typical_reply_time: data.typical_reply_time as ReplyTime,
        },
        profilePicture || undefined,
        validAudioFiles
      );

      onSuccess();
    } catch (error) {
      console.error("Error submitting actor:", error);
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

  const replyTimes: ReplyTime[] = [
    "Within 1 hour",
    "Within 4 hours",
    "Within 24 hours",
    "Within 48 hours",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-800">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="mt-1 block w-full rounded-md border border-violet-500 bg-white text-gray-800 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Location
        </label>
        <input
          type="text"
          {...register("location", { required: "Location is required" })}
          className="mt-1 block w-full rounded-md border border-violet-500 bg-white text-gray-800 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Bio</label>
        <textarea
          {...register("bio", { required: "Bio is required" })}
          rows={4}
          className="mt-1 block w-full rounded-md border border-violet-500 bg-white text-gray-800 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Categories
        </label>
        <div className="mt-2 space-y-2">
          {categories.map((category) => (
            <label key={category} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                {...register("categories")}
                value={category}
                className="rounded border-violet-500 text-violet-600 focus:ring-violet-500"
              />
              <span className="ml-2 text-gray-800">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Profile Picture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Audio Samples
        </label>
        <div className="space-y-4">
          {audioFiles.map((audio, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Sample title"
                value={audio.title}
                onChange={(e) => handleAudioTitleChange(index, e.target.value)}
                className="flex-1 rounded-md border border-violet-500 bg-white text-gray-800 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              />
              <input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  e.target.files &&
                  handleAudioFileChange(index, e.target.files[0])
                }
                className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAudioFileAdd}>
            Add Audio Sample
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
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
          className="mt-1 block w-full rounded-md border border-violet-500 bg-white text-gray-800 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Typical Reply Time
        </label>
        <select
          {...register("typical_reply_time", {
            required: "Reply time is required",
          })}
          className="mt-1 block w-full rounded-md border border-violet-500 bg-white text-gray-800 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        >
          <option value="">Select reply time</option>
          {replyTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {errors.typical_reply_time && (
          <p className="mt-1 text-sm text-red-600">
            {errors.typical_reply_time.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
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
          className="mt-1 block w-full rounded-md border border-violet-500 bg-white text-gray-800 shadow-sm focus:border-violet-500 focus:ring-violet-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Voice Actor"}
        </Button>
      </div>
    </form>
  );
}
