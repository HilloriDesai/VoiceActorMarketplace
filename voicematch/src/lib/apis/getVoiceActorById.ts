import { VoiceActor } from "@/types";
import { supabase } from "../supabase";

export async function getVoiceActorById(id: string) {
  const { data, error } = await supabase
    .from("voice_actors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as VoiceActor;
}
