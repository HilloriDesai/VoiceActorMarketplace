import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarProps {
  showBackButton?: boolean;
  title?: string;
}

export default function Navbar({ showBackButton = false, title }: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          )}
          <Link href="/" className="text-2xl font-bold text-violet-600">
            VoiceMatch
          </Link>
        </div>

        {title && (
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        )}

        <div className="flex items-center space-x-4">
          <Link
            href="/actors/new"
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
          >
            Add Voice Actor
          </Link>
        </div>
      </div>
    </nav>
  );
}
