"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { QuestionsList, QuestionResponse } from "@/app/components/QuestionsList";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";


function QuestionsContent() {
  const searchParams = useSearchParams();
  const searchId = searchParams.get("id");
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchId) {
      return;
    }

    async function fetchQuestions() {
      try {
        const response = await fetch(`/api/questions?searchId=${searchId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        if (data.searches && data.searches.length > 0) {
          setQuestions(data.searches[0].questions);
          setJobTitle(data.searches[0].job_title);
        }
      } catch (_err) {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [searchId]);

  if (!searchId) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No search ID provided</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Questions
          </h1>
          {jobTitle && (
            <p className="text-lg text-gray-600">
              For: <span className="font-semibold">{jobTitle}</span>
            </p>
          )}
        </div>

        <QuestionsList
          questions={questions}
          loading={loading}
          error={error}
        />

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Generate More Questions
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QuestionsContent />
    </Suspense>
  );
}