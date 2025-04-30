import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { VoiceActor } from "@/types";

interface ActorProfileProps {
  actor: VoiceActor;
  onInviteClick: () => void;
}

export default function ActorProfile({
  actor,
  onInviteClick,
}: ActorProfileProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-all hover:shadow-xl">
      <div className="md:flex items-start">
        <div className="md:flex-shrink-0 p-8">
          <div className="relative">
            <Image
              src={actor.profile_picture_url || "/placeholder-avatar.png"}
              alt={actor.name}
              width={240}
              height={240}
              className="object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="p-8 md:flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                {actor.name}
              </h1>
              <p className="text-gray-600 flex items-center text-lg mb-2">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {actor.location}
              </p>
            </div>
            <Button
              onClick={onInviteClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Invite to Job
            </Button>
          </div>

          <div className="flex items-center mb-6 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <span className="text-yellow-400 text-2xl">★</span>
              <span className="ml-2 text-xl font-semibold">{actor.rating}</span>
            </div>
            <div className="mx-4 text-gray-300">|</div>
            <span className="text-gray-600">{actor.review_count} reviews</span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">About</h2>
            <p className="text-gray-700 leading-relaxed">{actor.bio}</p>
          </div>

          {actor.certifications.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900">
                Certifications
              </h2>
              <div className="flex flex-wrap gap-2">
                {actor.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
