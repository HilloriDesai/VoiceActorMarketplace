import { VoiceActor, ReplyTime } from "@/types";

export type NewActorInput = Omit<
  VoiceActor,
  | "id"
  | "rating"
  | "review_count"
  | "last_online"
  | "last_hired"
  | "completed_jobs"
>;

export interface AudioFile {
  file: File;
  title: string;
}

export const CATEGORIES = [
  "Animation",
  "Commercials",
  "Audiobooks",
  "E-Learning",
  "Podcasts",
] as const;

export const REPLY_TIMES: ReplyTime[] = [
  "<1 hour",
  "1-2 hours",
  "1 day",
  "2+ days",
];
