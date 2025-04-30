export * from "./createActor";
export * from "./createJob";
export * from "./getVoiceActorByid";
export * from "./getVoiceActors";
export * from "./uploadScript";
export * from "./getActorReviews";

export interface ValidationResult<T = unknown> {
  success: boolean;
  errors: string[];
  data?: T;
}
