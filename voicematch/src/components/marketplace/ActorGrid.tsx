import React from "react";
import { VoiceActor } from "@/types";
import ActorCard from "./ActorCard";

interface ActorGridProps {
  actors: VoiceActor[];
  loading: boolean;
}

export default function ActorGrid({ actors, loading }: ActorGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actors.length > 0 ? (
        actors.map((actor) => <ActorCard key={actor.id} actor={actor} />)
      ) : (
        <div className="col-span-full text-center py-12 text-gray-500">
          No voice actors found. Try adjusting your search.
        </div>
      )}
    </div>
  );
}
