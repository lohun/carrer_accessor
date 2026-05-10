"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";

interface JobTitleFormProps {
  onSuccess?: (searchId: string) => void;
}

export function JobTitleForm({ onSuccess }: JobTitleFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: jobTitle.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const { searchId } = await response.json();

      if (onSuccess) {
        onSuccess(searchId);
      } else {
        router.push(`/questions?id=${searchId}`);
      }
    } catch (_err) {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter job title (e.g., Customer Success Manager)"
          className="w-full text-gray-600 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          disabled={loading}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !jobTitle.trim()}
        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Generating..." : "Generate Interview Questions"}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {loading && <LoadingSpinner />}
    </form>
  );
}