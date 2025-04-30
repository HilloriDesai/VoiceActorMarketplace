import React from "react";
import Image from "next/image";
import Link from "next/link";
import { VoiceActor } from "@/types";
import Button from "../ui/Button";
import { FaStar, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

interface ActorCardProps {
  actor: VoiceActor;
}

export default function ActorCard({ actor }: ActorCardProps) {
  const firstSample = actor.audio_samples[0];

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={actor.profile_picture_url || "/placeholder-avatar.png"}
              alt={actor.name}
              fill
              className="rounded-xl object-cover border-2 border-violet-100"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {actor.name}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <FaMapMarkerAlt className="w-4 h-4 text-violet-500 mr-1" />
              <p className="text-sm">{actor.location}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-medium">{actor.rating}</span>
                <span className="text-gray-500 text-sm ml-1">
                  ({actor.review_count})
                </span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <FaBriefcase className="w-4 h-4 mr-1" />
                <span>{actor.completed_jobs || 0} jobs</span>
              </div>
            </div>
          </div>
        </div>

        {actor.categories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {actor.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-50 text-violet-700 border border-violet-100"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {firstSample && (
          <div className="mb-6 bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">Featured Sample:</span>
              <span className="text-violet-600">{firstSample.title}</span>
            </h4>
            <audio
              src={firstSample.url}
              controls
              className="w-full h-8 [&::-webkit-media-controls-panel]:bg-white"
            />
          </div>
        )}

        <Link href={`/actors/${actor.id}`} className="block">
          <Button
            variant="primary"
            className="w-full py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
