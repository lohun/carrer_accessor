export interface InterviewQuestion {
  id: string;
  search_id: string;
  question_text: string;
  focus_area: string;
  what_it_seeks: string;
  question_order: number;
  created_at: string;
}

export interface JobSearch {
  id: string;
  job_title: string;
  created_at: string;
  api_response_time_ms: number | null;
  api_status: string;
  error_message: string | null;
}

export interface QuestionResponse {
  id: string;
  question: string;
  focus_area: string;
  what_it_seeks: string;
}

export interface GenerateQuestionsRequest {
  jobTitle: string;
}

export interface GenerateQuestionsResponse {
  searchId: string;
  questions: QuestionResponse[];
}

export interface QuestionsApiResponse {
  searches: (JobSearch & { questions: InterviewQuestion[] })[];
  total: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "ERROR" | "WARNING";
  category: string;
  message: string;
  metadata?: Record<string, unknown>;
  user_session_id?: string;
}

export type LogCategory =
  | "API_CALL"
  | "USER_INPUT"
  | "DB_QUERY"
  | "API_ERROR"
  | "USER_INTERACTION";

export type ApiStatus = "success" | "error" | "retry";