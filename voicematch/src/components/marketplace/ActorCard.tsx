import React from "react";
import Image from "next/image";
import Link from "next/link";
import { VoiceActor } from "@/types";
import Button from "../ui/Button";

interface ActorCardProps {
  actor: VoiceActor;
}

export default function ActorCard({ actor }: ActorCardProps) {
  const firstSample = actor.audio_samples[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="relative w-16 h-16 mr-4">
            <Image
              src={actor.profile_picture_url || "/placeholder-avatar.png"}
              alt={actor.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{actor.name}</h3>
            <p className="text-gray-500">{actor.location}</p>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">
                {actor.rating} ({actor.review_count} reviews)
              </span>
            </div>
          </div>
        </div>

        {actor.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {actor.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
            {actor.categories.length > 3 && (
              <span className="text-gray-500 text-xs px-2 py-1">
                +{actor.categories.length - 3} more
              </span>
            )}
          </div>
        )}

        {firstSample && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">
              Sample: {firstSample.title}
            </h4>
            <audio src={firstSample.url} controls className="w-full h-8" />
          </div>
        )}

        <Link href={`/actors/${actor.id}`} className="block">
          <Button variant="primary" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
