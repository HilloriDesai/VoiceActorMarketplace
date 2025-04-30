"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getVoiceActors } from "@/lib/apis";
import { VoiceActor, ActorFilterParams } from "@/types";
import Navbar from "@/components/ui/Navbar";
import SearchFilters from "@/components/marketplace/SearchFilters";
import ActorGrid from "@/components/marketplace/ActorGrid";

export default function Home() {
  const [actors, setActors] = useState<VoiceActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prevSearchQuery, setPrevSearchQuery] = useState("");
  const [prevCategory, setPrevCategory] = useState<string | null>(null);

  const performSearch = useCallback(
    async (query: string, category: string | null) => {
      // Don't search if inputs haven't changed
      if (query === prevSearchQuery && category === prevCategory) {
        return;
      }

      try {
        setLoading(true);
        const filters: ActorFilterParams = {};

        if (query.trim()) {
          filters.searchQuery = query.trim();
        }

        if (category) {
          filters.categories = [category];
        }

        const data = await getVoiceActors(filters);
        setActors(data);
        setPrevSearchQuery(query);
        setPrevCategory(category);
      } catch (error) {
        console.error("Error searching voice actors:", error);
      } finally {
        setLoading(false);
      }
    },
    [prevSearchQuery, prevCategory]
  );

  // Debounced search function for text input
  const debouncedSearch = useDebouncedCallback(
    (query: string) => {
      performSearch(query, selectedCategory);
    },
    500 // 500ms delay
  );

  // Handle text search input
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle category selection - immediate search
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    performSearch(searchQuery, category);
  };

  // Initial load
  useEffect(() => {
    // Get all actors
    const fetchActors = async () => {
      try {
        const data = await getVoiceActors();
        setActors(data);
      } catch (error) {
        console.error("Error fetching actors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActors();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={handleSearchInput}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onSearch={() => performSearch(searchQuery, selectedCategory)}
        />
        <ActorGrid actors={actors} loading={loading} />
      </main>
    </>
  );
}
