"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getVoiceActorById, getActorReviews } from "@/lib/api";
import { VoiceActor, Review } from "@/types";
import Button from "@/components/ui/Button";
import { Dialog } from "@headlessui/react";
import JobForm from "@/components/jobs/JobForm";

export default function ActorProfilePage() {
  const params = useParams();
  const actorId = params.id as string;

  const [actor, setActor] = useState<VoiceActor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const handleJobSuccess = () => {
    setIsJobModalOpen(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [actorData, reviewsData] = await Promise.all([
          getVoiceActorById(actorId),
          getActorReviews(actorId),
        ]);
        setActor(actorData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error loading actor profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (actorId) {
      loadData();
    }
  }, [actorId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Voice Actor Not Found</h1>
        <p>We couldn not find the voice actor you are looking for.</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0 p-6">
            <img
              src={actor.profile_picture_url || "/placeholder-avatar.png"}
              alt={actor.name}
              className="h-48 w-48 object-cover rounded-full mx-auto"
            />
          </div>
          <div className="p-6 md:flex-1">
            <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>
            <p className="text-gray-500 mb-4">{actor.location}</p>

            <div className="flex items-center mb-4">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="ml-1 text-lg">
                {actor.rating} ({actor.review_count} reviews)
              </span>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700">{actor.bio}</p>
            </div>

            {actor.certifications.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Certifications</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {actor.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={() => setIsJobModalOpen(true)}
              className="w-full md:w-auto"
            >
              Invite to Job
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Info */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Activity</h2>
        <ul className="text-gray-700 space-y-2">
          <li>Last Online: {new Date(actor.last_online).toLocaleString()}</li>
          <li>Typical Reply Time: {actor.typical_reply_time}</li>
          <li>
            Last Hired:{" "}
            {actor.last_hired
              ? new Date(actor.last_hired).toLocaleDateString()
              : "N/A"}
          </li>
          <li>Completed Jobs: {actor.completed_jobs}</li>
        </ul>
      </div>

      {/* Past Clients */}
      {actor.past_clients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Past Clients</h2>
          <div className="flex flex-wrap gap-2">
            {actor.past_clients.map((client, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-sm text-gray-800 px-3 py-1 rounded-full"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{review.reviewer_name}</span>
                  <span className="text-yellow-500">★ {review.rating}</span>
                </div>
                <p className="text-gray-700">
                  {review.comment || "No comment provided."}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Invite Modal */}
      <Dialog
        open={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Invite {actor.name} to a Job
            </Dialog.Title>
            <JobForm
              actorId={actor.id}
              onClose={() => setIsJobModalOpen(false)}
              onSuccess={handleJobSuccess}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </main>
  );
}
