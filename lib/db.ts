import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";
import type {
  JobSearch,
  InterviewQuestion,
  QuestionResponse,
  ApiStatus,
} from "./types";

/**
 * Creates a new job search record in Supabase.
 */
export async function createJobSearch(
  id: string,
  jobTitle: string,
  apiStatus: ApiStatus,
  apiResponseTimeMs?: number,
  errorMessage?: string
): Promise<void> {
  const { error } = await supabase.from("job_searches").insert({
    id,
    job_title: jobTitle,
    api_status: apiStatus,
    api_response_time_ms: apiResponseTimeMs ?? null,
    error_message: errorMessage ?? null,
  });

  if (error) {
    console.error("Error creating job search:", error);
    throw error;
  }
}

/**
 * Saves a list of generated interview questions to Supabase.
 */
export async function saveQuestions(
  searchId: string,
  questions: QuestionResponse[]
): Promise<void> {
  const questionsToInsert = questions.map((q, index) => ({
    id: uuidv4(),
    search_id: searchId,
    question_text: q.question,
    focus_area: q.focus_area,
    what_it_seeks: q.what_it_seeks,
    question_order: index + 1,
  }));

  const { error } = await supabase.from("interview_questions").insert(questionsToInsert);

  if (error) {
    console.error("Error saving questions:", error);
    throw error;
  }
}

/**
 * Retrieves all interview questions for a specific search ID.
 */
export async function getQuestionsBySearchId(
  searchId: string
): Promise<InterviewQuestion[]> {
  const { data, error } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("search_id", searchId)
    .order("question_order", { ascending: true });

  if (error) {
    console.error("Error getting questions:", error);
    throw error;
  }

  return data as InterviewQuestion[];
}

/**
 * Retrieves a list of job searches with pagination.
 */
export async function getSearches(limit = 10, offset = 0): Promise<JobSearch[]> {
  const { data, error } = await supabase
    .from("job_searches")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error getting searches:", error);
    throw error;
  }

  return data as JobSearch[];
}

/**
 * Retrieves a specific job search by ID.
 */
export async function getSearchById(id: string): Promise<JobSearch | null> {
  const { data, error } = await supabase
    .from("job_searches")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // No rows found
    console.error("Error getting search by ID:", error);
    throw error;
  }

  return data as JobSearch;
}

/**
 * Gets the total number of job searches.
 */
export async function getTotalSearchCount(): Promise<number> {
  const { count, error } = await supabase
    .from("job_searches")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error getting total search count:", error);
    throw error;
  }

  return count || 0;
}