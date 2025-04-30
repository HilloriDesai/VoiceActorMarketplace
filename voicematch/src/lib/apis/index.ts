export * from "./createActor";
export * from "./createJob";
export * from "./getVoiceActors";
export * from "./uploadScript";
export * from "./getActorReviews";
export * from "./getVoiceActorById";

export interface ValidationResult<T = unknown> {
  success: boolean;
  errors: string[];
  data?: T;
}
