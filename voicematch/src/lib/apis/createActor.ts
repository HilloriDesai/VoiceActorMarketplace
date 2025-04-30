import { supabase } from "./../supabase";
import { VoiceActor } from "../../types";
import { v4 as uuidv4 } from "uuid";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_SIZE,
} from "../constants";
import { validateField, VALIDATION_RULES } from "./../validations";
import { ValidationResult } from ".";

// Type definitions for VoiceActor and Job
interface VoiceActorInput
  extends Omit<
    VoiceActor,
    | "id"
    | "rating"
    | "review_count"
    | "last_online"
    | "last_hired"
    | "completed_jobs"
  > {
  hourly_rate?: number;
}

export async function createActor(
  actor: VoiceActorInput,
  profilePicture?: File,
  audioSamples?: { file: File; title: string }[]
): Promise<ValidationResult<VoiceActor>> {
  try {
    // Validate required fields
    const validationErrors: string[] = [];

    // Validate name
    const nameError = validateField("Name", actor.name, VALIDATION_RULES.name);
    if (nameError) validationErrors.push(nameError);

    // Validate categories
    const categoriesError = validateField(
      "Categories",
      actor.categories,
      VALIDATION_RULES.categories
    );
    if (categoriesError) validationErrors.push(categoriesError);

    // Validate hourly rate
    if (actor.hourly_rate !== undefined && actor.hourly_rate < 0) {
      validationErrors.push("Hourly rate cannot be negative");
    }

    // Return early if there are validation errors
    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }

    // Upload profile picture if provided
    let profilePictureUrl = "";
    if (profilePicture) {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(profilePicture.type)) {
        return {
          success: false,
          errors: [
            `Invalid profile picture format. Allowed types are: ${ALLOWED_IMAGE_TYPES.join(
              ", "
            )}`,
          ],
        };
      }

      // Validate file size
      if (profilePicture.size > MAX_IMAGE_SIZE) {
        return {
          success: false,
          errors: [
            `Profile picture size too large. Maximum size allowed is ${
              MAX_IMAGE_SIZE / (1024 * 1024)
            }MB`,
          ],
        };
      }

      console.log("Starting profile picture upload...");
      const fileName = `${uuidv4()}-${profilePicture.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(`pictures/${fileName}`, profilePicture);

      if (uploadError) {
        console.error("Profile picture upload failed:", uploadError);
        return {
          success: false,
          errors: ["Failed to upload profile picture. Please try again."],
        };
      }

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(`pictures/${fileName}`);

      profilePictureUrl = publicUrlData.publicUrl;
      console.log("Profile picture uploaded successfully:", profilePictureUrl);
    }

    // Upload audio samples if provided
    const audioSamplesData = [];
    if (audioSamples) {
      console.log(`Starting upload of ${audioSamples.length} audio samples...`);
      for (const sample of audioSamples) {
        if (!sample.title) {
          return {
            success: false,
            errors: ["Each audio sample must have a title"],
          };
        }

        const titleError = validateField("Audio sample title", sample.title, {
          min: 1,
          max: 100,
        });
        if (titleError) {
          return {
            success: false,
            errors: [titleError],
          };
        }

        if (sample.file.size > 0) {
          // Validate audio file type
          if (!ALLOWED_AUDIO_TYPES.includes(sample.file.type)) {
            return {
              success: false,
              errors: [
                `Invalid audio format for "${
                  sample.title
                }". Allowed types are: ${ALLOWED_AUDIO_TYPES.join(", ")}`,
              ],
            };
          }

          // Validate audio file size
          if (sample.file.size > MAX_AUDIO_SIZE) {
            return {
              success: false,
              errors: [
                `Audio file "${
                  sample.title
                }" is too large. Maximum size allowed is ${
                  MAX_AUDIO_SIZE / (1024 * 1024)
                }MB`,
              ],
            };
          }

          console.log(`Uploading audio sample: ${sample.title}`);
          const fileName = `${uuidv4()}-${sample.file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("audio-samples")
            .upload(`samples/${fileName}`, sample.file);

          if (uploadError) {
            console.error(
              `Audio sample upload failed for ${sample.title}:`,
              uploadError
            );
            return {
              success: false,
              errors: [
                `Failed to upload audio sample "${sample.title}". Please try again.`,
              ],
            };
          }

          // Get the public URL for the uploaded audio file
          const { data: publicUrlData } = supabase.storage
            .from("audio-samples")
            .getPublicUrl(`samples/${fileName}`);

          audioSamplesData.push({
            title: sample.title,
            url: publicUrlData.publicUrl,
          });
          console.log(`Audio sample uploaded successfully: ${sample.title}`);
        }
      }
    }

    // Create the voice actor record
    const { data, error } = await supabase
      .from("voice_actors")
      .insert({
        ...actor,
        profile_picture_url: profilePictureUrl,
        audio_samples: audioSamplesData,
        rating: 0,
        review_count: 0,
        completed_jobs: 0,
        last_online: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create voice actor record:", error);
      return {
        success: false,
        errors: ["Failed to create voice actor record. Please try again."],
      };
    }

    return {
      success: true,
      errors: [],
      data: data as VoiceActor,
    };
  } catch (error) {
    console.error("Error in createActor:", {
      error,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      errors: ["An unexpected error occurred. Please try again."],
    };
  }
}
