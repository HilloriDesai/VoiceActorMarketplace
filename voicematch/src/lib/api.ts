import { supabase } from "./supabase";
import { VoiceActor, Job, Review, ActorFilterParams } from "../types";

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
export async function createJob(job: Omit<Job, "id" | "submitted_at">) {
  const { data, error } = await supabase
    .from("jobs")
    .insert(job)
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

// File Upload
export async function uploadScript(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from("job-scripts")
    .upload(`scripts/${fileName}`, file);

  if (error) throw error;
  return data.path;
}
