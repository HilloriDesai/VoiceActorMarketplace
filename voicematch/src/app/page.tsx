"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getVoiceActors } from "@/lib/api";
import { VoiceActor, ActorFilterParams } from "@/types";
import ActorCard from "@/components/marketplace/ActorCard";

export default function Home() {
  const [actors, setActors] = useState<VoiceActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    "Animation",
    "Commercials",
    "Audiobooks",
    "E-Learning",
    "Podcasts",
  ];

  useEffect(() => {
    const loadActors = async () => {
      try {
        setLoading(true);
        const data = await getVoiceActors();
        setActors(data);
      } catch (error) {
        console.error("Error loading voice actors:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActors();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters: ActorFilterParams = {};

      if (searchQuery) {
        filters.searchQuery = searchQuery;
      }

      if (selectedCategories.length > 0) {
        filters.categories = selectedCategories;
      }

      const data = await getVoiceActors(filters);
      setActors(data);
    } catch (error) {
      console.error("Error searching voice actors:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Voice Actor Marketplace</h1>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search by name, skill, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
            <Link
              href="/actors/new"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add Voice Actor
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium">Categories:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`text-sm px-3 py-1 rounded-full ${
                selectedCategories.includes(category)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actors.length > 0 ? (
            actors.map((actor) => <ActorCard key={actor.id} actor={actor} />)
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No voice actors found. Try adjusting your search.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
