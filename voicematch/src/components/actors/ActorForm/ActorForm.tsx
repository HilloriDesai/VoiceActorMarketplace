import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { FaCheck, FaExclamationCircle } from "react-icons/fa";
import { createActor } from "@/lib/apis";
import { ProfilePictureUpload } from "./components/ProfilePictureUpload";
import { AudioSamplesUpload } from "./components/AudioSamplesUpload";
import { CategorySelection } from "./components/CategorySelection";
import { BasicInformation } from "./components/BasicInformation";
import { NewActorInput, AudioFile } from "./components/types";

interface ActorFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ActorForm({ onClose, onSuccess }: ActorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewActorInput>();

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

  const handleAudioFileRemove = (index: number) => {
    const newAudioFiles = [...audioFiles];
    newAudioFiles.splice(index, 1);
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
        typical_reply_time: data.typical_reply_time,
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
        <ProfilePictureUpload
          onFileChange={setProfilePicture}
          currentFile={profilePicture}
        />

        <BasicInformation register={register} errors={errors} />

        <CategorySelection register={register} error={errors.categories} />

        <AudioSamplesUpload
          audioFiles={audioFiles}
          onAudioFileAdd={handleAudioFileAdd}
          onAudioFileChange={handleAudioFileChange}
          onAudioTitleChange={handleAudioTitleChange}
          onAudioFileRemove={handleAudioFileRemove}
        />

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
