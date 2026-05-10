import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/gemini";
import { createJobSearch, saveQuestions } from "@/lib/db";
import { logger } from "@/lib/logger";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { jobTitle } = await request.json();

    if (!jobTitle || typeof jobTitle !== "string") {
      return NextResponse.json({ error: "Invalid job title" }, { status: 400 });
    }

    await logger.log("INFO", "USER_INPUT", "Job title submitted", {
      job_title: jobTitle,
    });

    const searchId = uuidv4();

    const questions = await generateInterviewQuestions(jobTitle);

    const apiResponseTimeMs = 0;

    await createJobSearch(searchId, jobTitle, "success", apiResponseTimeMs);
    await saveQuestions(searchId, questions);

    await logger.log("INFO", "DB_QUERY", "Questions saved to database", {
      search_id: searchId,
      questions_count: questions.length,
    });

    return NextResponse.json({ searchId, questions });
  } catch (error) {
    await logger.log(
      "ERROR",
      "API_ERROR",
      `Failed to generate questions: ${error instanceof Error ? error.message : String(error)}`
    );

    return NextResponse.json(
      { error: "Failed to generate questions. Please try again." },
      { status: 500 }
    );
  }
}