import { supabase } from "../supabase";

// File Upload
export async function uploadScript(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from("job-scripts")
    .upload(`scripts/${fileName}`, file);

  if (error) throw error;
  return data.path;
}
