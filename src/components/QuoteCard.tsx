'use client';

import React from 'react';
import { Quote } from '@/data/quotes';

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-black bg-opacity-70 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
      <blockquote className="text-2xl font-serif italic text-white mb-4">
        &quot;{quote.text}&quot;
      </blockquote>
      {quote.rule && (
        <p className="text-sm text-gray-300 font-mono">
          {quote.rule}
        </p>
      )}
    </div>
  );
} 