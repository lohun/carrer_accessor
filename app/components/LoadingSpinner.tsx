"use client";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">
          Generating interview questions...
        </p>
      </div>
    </div>
  );
}