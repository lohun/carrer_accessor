import { JobTitleForm } from "@/app/components/JobTitleForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Career Accessor
          </h1>
          <p className="text-gray-600">
            Generate thoughtful interview questions for any role
          </p>
        </div>

        <JobTitleForm />

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600">
            <strong>Example:</strong> Try &quot;Customer Success Manager&quot;, &quot;Software
            Engineer&quot;, or any role you&apos;re interested in.
          </p>
        </div>
      </div>
    </div>
  );
}