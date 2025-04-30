import { Review } from "@/types";
import { supabase } from "../supabase";

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
