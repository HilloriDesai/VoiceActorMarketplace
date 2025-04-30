import React from "react";
import { Review } from "@/types";

interface ActorReviewsProps {
  reviews: Review[];
}

export default function ActorReviews({ reviews }: ActorReviewsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Reviews</h2>
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-gray-500 text-lg">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                    {review.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.reviewer_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium text-gray-900">
                    {review.rating}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {review.comment || "No comment provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
