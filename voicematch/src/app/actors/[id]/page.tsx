"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getVoiceActorById, getActorReviews } from "@/lib/api";
import { VoiceActor, Review } from "@/types";
import Navbar from "@/components/ui/Navbar";
import ActorProfile from "../../../components/actors/ActorProfile";
import ActorActivity from "../../../components/actors/ActorActivity";
import ActorReviews from "../../../components/actors/ActorReviews";
import JobInviteModal from "../../../components/actors/JobInviteModal";

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
      <>
        <Navbar showBackButton title="Voice Actor Profile" />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!actor) {
    return (
      <>
        <Navbar showBackButton title="Voice Actor Profile" />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Voice Actor Not Found</h1>
          <p>We couldn not find the voice actor you are looking for.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar showBackButton title={actor.name} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <ActorProfile
          actor={actor}
          onInviteClick={() => setIsJobModalOpen(true)}
        />
        <ActorActivity actor={actor} />
        <ActorReviews reviews={reviews} />
        <JobInviteModal
          isOpen={isJobModalOpen}
          onClose={() => setIsJobModalOpen(false)}
          onSuccess={handleJobSuccess}
          actorId={actor.id}
          actorName={actor.name}
        />
      </main>
    </>
  );
}
