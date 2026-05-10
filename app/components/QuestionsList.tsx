import { QuestionCard } from "./QuestionCard";

export interface QuestionResponse {
  [x: string]: string;
  id: string;
  question_text: string;
  focus_area: string;
  what_it_seeks: string;
}

interface QuestionsListProps {
  questions: QuestionResponse[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function QuestionsList({
  questions,
  loading,
  error,
  onRetry,
}: QuestionsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-500">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-700 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-gray-600">No questions found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {questions.map((q, index) => (
        <QuestionCard
          key={q.id}
          question_text={q.question_text}
          focus_area={q.focus_area}
          what_it_seeks={q.what_it_seeks}
          order={index + 1}
        />
      ))}
    </div>
  );
}