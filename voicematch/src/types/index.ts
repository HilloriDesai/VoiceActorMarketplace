export type Category = "Animation" | "Commercial" | "Audiobook" | "Podcast"; // extend as needed
export type VoiceGender = "Male" | "Female" | "Other";
export type ReplyTime = "<1 hour" | "1-2 hours" | "1 day" | "2+ days";

export interface VoiceActor {
  id: string;
  name: string;
  location: string;
  rating: number; // NUMERIC(2,1) in database
  review_count: number; // default: 0
  profile_picture_url: string;
  bio: string;
  categories: string[];
  audio_samples: AudioSample[]; // JSONB array with {title, url} structure
  certifications: string[];
  last_online: string; // ISO date string (from TIMESTAMP WITH TIME ZONE)
  typical_reply_time: ReplyTime; // constrained values
  last_hired?: string | null; // ISO date string (from TIMESTAMP WITH TIME ZONE)
  completed_jobs: number; // default: 0
  past_clients: string[];
}

export interface AudioSample {
  title: string;
  url: string;
}

export interface Job {
  id: string;
  actor_id: string;
  project_name: string;
  category: Category;
  character_traits: string[];
  language: string;
  accent: string;
  voice_gender: VoiceGender;
  script_url: string;
  estimated_length_minutes: number;
  deadline: string; // ISO date string (from TIMESTAMP WITH TIME ZONE)
  budget: number;
  approval_process: string;
  submitted_at: string; // ISO date string (from TIMESTAMP WITH TIME ZONE)
}

export interface Review {
  id: string;
  actor_id: string;
  reviewer_name: string;
  rating: number; // NUMERIC(2,1) in database
  comment?: string | null;
  created_at: string; // ISO date string (from TIMESTAMP WITH TIME ZONE)
}

export interface ActorFilterParams {
  searchQuery?: string;
  categories?: string[];
  minRating?: number;
}

export interface NewJobInput {
  actor_id: string;
  project_name: string;
  category: Category;
  character_traits: string[];
  language: string;
  accent: string;
  voice_gender: VoiceGender;
  script_url: string;
  estimated_length_minutes: number;
  deadline: string;
  budget: number;
  approval_process: string;
}

export interface NewReviewInput {
  actor_id: string;
  reviewer_name: string;
  rating: number;
  comment?: string;
}
