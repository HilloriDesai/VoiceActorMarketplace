import { supabase } from "./../supabase";
import { Job, NewJobInput } from "../../types";
import { validateField, VALIDATION_RULES } from "./../validations";
import { ValidationResult } from ".";

export async function createJob(
  job: NewJobInput
): Promise<ValidationResult<Job>> {
  try {
    // Validate required fields
    const validationErrors: string[] = [];

    // Validate project name
    const projectNameError = validateField(
      "Project name",
      job.project_name,
      VALIDATION_RULES.title
    );
    if (projectNameError) validationErrors.push(projectNameError);

    // Validate category
    if (!job.category) {
      validationErrors.push("Category is required");
    }

    // Validate voice gender
    if (!job.voice_gender) {
      validationErrors.push("Voice gender is required");
    }

    // Validate budget
    if (!job.budget || job.budget <= 0) {
      validationErrors.push("Budget must be greater than 0");
    }

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

    // Validate estimated length
    if (!job.estimated_length_minutes || job.estimated_length_minutes <= 0) {
      validationErrors.push("Estimated length must be greater than 0");
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        ...job,
        submitted_at: new Date().toISOString(),
      })
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
