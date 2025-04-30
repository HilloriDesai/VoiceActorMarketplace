import { supabase } from "./supabase";
import { VoiceActor, Job, Review, ActorFilterParams } from "../types";
import { v4 as uuidv4 } from "uuid";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_SIZE,
  ALLOWED_SCRIPT_TYPES,
  MAX_SCRIPT_SIZE,
} from "./constants";
import { validateField, VALIDATION_RULES } from "./validations";

// Voice Actor APIs
export async function getVoiceActors(filters?: ActorFilterParams) {
  let query = supabase.from("voice_actors").select("*");

  if (filters) {
    if (filters.searchQuery) {
      query = query.ilike("name", `%${filters.searchQuery}%`);
    }

    if (filters.categories && filters.categories.length > 0) {
      query = query.contains("categories", filters.categories);
    }

    if (filters.minRating) {
      query = query.gte("rating", filters.minRating);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as VoiceActor[];
}

export async function getVoiceActorById(id: string) {
  const { data, error } = await supabase
    .from("voice_actors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as VoiceActor;
}

// Update type definitions for VoiceActor and Job
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
  description: string;
  hourly_rate?: number;
}

interface JobInput extends Omit<Job, "id" | "submitted_at" | "script_url"> {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  script_url?: string;
}

// Add new interfaces for validation results
interface ValidationResult<T = unknown> {
  success: boolean;
  errors: string[];
  data?: T;
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

    // Validate description
    const descError = validateField(
      "Description",
      actor.description,
      VALIDATION_RULES.description
    );
    if (descError) validationErrors.push(descError);

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
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(`pictures/${fileName}`, profilePicture);

      if (uploadError) {
        console.error("Profile picture upload failed:", uploadError);
        return {
          success: false,
          errors: ["Failed to upload profile picture. Please try again."],
        };
      }
      profilePictureUrl = uploadData.path;
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
          const { data: uploadData, error: uploadError } =
            await supabase.storage
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
          audioSamplesData.push({
            title: sample.title,
            url: uploadData.path,
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

// Reviews APIs
export async function getActorReviews(actorId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("actor_id", actorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Review[];
}

// Jobs APIs
export async function createJob(job: JobInput): Promise<ValidationResult<Job>> {
  try {
    // Validate required fields
    const validationErrors: string[] = [];

    // Validate title
    const titleError = validateField(
      "Title",
      job.title,
      VALIDATION_RULES.title
    );
    if (titleError) validationErrors.push(titleError);

    // Validate description
    const descError = validateField(
      "Description",
      job.description,
      VALIDATION_RULES.description
    );
    if (descError) validationErrors.push(descError);

    // Validate budget
    const budgetError = validateField(
      "Budget",
      job.budget,
      VALIDATION_RULES.budget
    );
    if (budgetError) validationErrors.push(budgetError);

    // Validate deadline
    if (!job.deadline) {
      validationErrors.push("Deadline is required");
    } else {
      const deadlineDate = new Date(job.deadline);
      const now = new Date();
      if (deadlineDate <= now) {
        validationErrors.push("Deadline must be in the future");
      }
    }

    // Validate script if provided
    if (job.script_url) {
      const scriptFile = new File([job.script_url], "script");

      if (!ALLOWED_SCRIPT_TYPES.includes(scriptFile.type)) {
        validationErrors.push(
          `Invalid script format. Allowed types are: ${ALLOWED_SCRIPT_TYPES.join(
            ", "
          )}`
        );
      }

      if (scriptFile.size > MAX_SCRIPT_SIZE) {
        validationErrors.push(
          `Script file is too large. Maximum size allowed is ${
            MAX_SCRIPT_SIZE / (1024 * 1024)
          }MB`
        );
      }
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert(job)
      .select()
      .single();

    if (error) {
      console.error("Failed to create job:", error);
      return {
        success: false,
        errors: ["Failed to create job. Please try again."],
      };
    }

    return {
      success: true,
      errors: [],
      data: data as Job,
    };
  } catch (error) {
    console.error("Error in createJob:", {
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

// File Upload
export async function uploadScript(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from("job-scripts")
    .upload(`scripts/${fileName}`, file);

  if (error) throw error;
  return data.path;
}
