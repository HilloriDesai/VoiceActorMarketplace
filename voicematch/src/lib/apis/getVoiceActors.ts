import { ActorFilterParams, VoiceActor } from "@/types";
import { supabase } from "../supabase";

// Voice Actor APIs
export async function getVoiceActors(filters?: ActorFilterParams) {
  let query = supabase.from("voice_actors").select("*");

  if (filters) {
    console.log("Filters:", filters);
    if (filters.searchQuery && filters.searchQuery.trim()) {
      query = query.ilike("name", `%${filters.searchQuery.trim()}%`);
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
