'use client';

import { useState, useRef } from "react";
import { quotes } from "@/data/quotes";
import QuoteCard from "@/components/QuoteCard";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg";

// AI-curated, strictly bicycle/cycling-related keywords for Pexels API
const PEXELS_KEYWORDS = [
  "bicycle",
  "bicycles",
  "cycling",
  "cyclist",
  "cyclists",
  "bike racing",
  "road cycling",
  "road bike",
  "road bikes",
  "peloton",
  "vintage bicycle",
  "vintage cycling",
  "tour de france",
  "giro d'italia",
  "vuelta a españa",
  "uci",
  "bicycle race",
  "cycle race",
  "bicycle event",
  "bicycle competition",
  "bicycle group ride",
  "bicycle adventure",
  "bicycle journey",
  "bicycle touring",
  "bikepacking",
  "fixed gear",
  "track cycling",
  "bicycle love",
  "enjoy cycling",
  "happy cyclist",
  "bicycle lifestyle",
  "bicycle friends",
  "bicycle fun",
  "bicycle outdoors",
  "bicycle nature",
  "bicycle scenery",
  "bicycle landscape",
  "bicycle portrait",
  "bicycle art"
].join(",");

function shuffleArray(array: string[]): string[] {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function fetchCyclingImagesBatch() {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(PEXELS_KEYWORDS)}&per_page=80`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || '',
        },
      }
    );
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      // Shuffle the batch
      return shuffleArray(data.photos.map((p: { src: { landscape: string } }) => p.src.landscape));
    }
  } catch {
    // ignore
  }
  return [FALLBACK_IMAGE];
}

export default function ClientPage() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [currentBackground, setCurrentBackground] = useState(FALLBACK_IMAGE);
  const [isLoading, setIsLoading] = useState(false);
  const imagesBatchRef = useRef<string[]>([FALLBACK_IMAGE]);
  const imageIndexRef = useRef<number>(0);

  const getRandomQuote = async () => {
    setIsLoading(true);
    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomQuoteIndex]);

    // If we've used all images in the batch, fetch a new batch
    if (
      !imagesBatchRef.current ||
      imageIndexRef.current >= imagesBatchRef.current.length - 1
    ) {
      imagesBatchRef.current = await fetchCyclingImagesBatch();
      imageIndexRef.current = 0;
    } else {
      imageIndexRef.current++;
    }
    const newImageUrl = imagesBatchRef.current[imageIndexRef.current];
    setCurrentBackground(newImageUrl);
    setIsLoading(false);
  };

  return (
    <main
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('${currentBackground}')`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#222"
      }}
    >
      {/* <div className="absolute inset-0 bg-black bg-opacity-50" /> */}
      {isLoading ? (
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            The Rules of Cycling
          </h1>
          <div className="text-center text-white">Loading...</div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            The Rules of Cycling
          </h1>
          <QuoteCard quote={currentQuote} />
          <div className="mt-8 text-center">
            <button
              onClick={getRandomQuote}
              className="px-6 py-3 bg-white text-gray-800 rounded-lg transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              New Rule
            </button>
          </div>
        </div>
      )}
    </main>
  );
} 