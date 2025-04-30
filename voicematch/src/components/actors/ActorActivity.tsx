import React from "react";
import { VoiceActor } from "@/types";

interface ActorActivityProps {
  actor: VoiceActor;
}

export default function ActorActivity({ actor }: ActorActivityProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Activity</h2>
        <ul className="space-y-4">
          <li className="flex items-center text-gray-700">
            <div className="bg-green-50 p-2 rounded-lg mr-4">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Online</p>
              <p className="font-medium">
                {new Date(actor.last_online).toLocaleString()}
              </p>
            </div>
          </li>
          <li className="flex items-center text-gray-700">
            <div className="bg-blue-50 p-2 rounded-lg mr-4">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Typical Reply Time</p>
              <p className="font-medium">{actor.typical_reply_time}</p>
            </div>
          </li>
          <li className="flex items-center text-gray-700">
            <div className="bg-purple-50 p-2 rounded-lg mr-4">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Jobs</p>
              <p className="font-medium">{actor.completed_jobs}</p>
            </div>
          </li>
        </ul>
      </div>

      {actor.past_clients.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Past Clients
          </h2>
          <div className="flex flex-wrap gap-2">
            {actor.past_clients.map((client, idx) => (
              <span
                key={idx}
                className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
