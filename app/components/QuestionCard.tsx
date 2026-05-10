"use client";

import { useState } from "react";

interface QuestionCardProps {
  question_text: string;
  focus_area: string;
  what_it_seeks: string;
  order: number;
}

export function QuestionCard({
  question_text,
  focus_area,
  what_it_seeks,
  order,
}: QuestionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(question_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500">
          Question {order}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-200 rounded transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
          {focus_area}
        </span>
      </div>

      <p className="text-gray-800 font-medium mb-4 text-lg leading-relaxed">
        &quot;{question_text}&quot;
      </p>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">WHAT IT SEEKS:</p>
        <p className="text-sm text-gray-700">{what_it_seeks}</p>
      </div>
    </div>
  );
}