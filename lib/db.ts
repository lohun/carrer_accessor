import Database from "better-sqlite3";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  JobSearch,
  InterviewQuestion,
  QuestionResponse,
  ApiStatus,
} from "./types";

const DB_PATH = path.join(process.cwd(), "dev.db");

let db: Database.Database;

function initializeTables(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS job_searches (
      id TEXT PRIMARY KEY,
      job_title TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      api_response_time_ms INTEGER,
      api_status TEXT,
      error_message TEXT
    );

    CREATE TABLE IF NOT EXISTS interview_questions (
      id TEXT PRIMARY KEY,
      search_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      focus_area TEXT,
      what_it_seeks TEXT,
      question_order INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (search_id) REFERENCES job_searches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT DEFAULT (datetime('now')),
      level TEXT,
      category TEXT,
      message TEXT,
      metadata TEXT,
      user_session_id TEXT
    );
  `);
}

function _getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initializeTables();
  }
  return db;
}

export { _getDb as getDb };

export function createJobSearch(
  id: string,
  jobTitle: string,
  apiStatus: ApiStatus,
  apiResponseTimeMs?: number,
  errorMessage?: string
): void {
  const database = _getDb();
  const stmt = database.prepare(`
    INSERT INTO job_searches (id, job_title, api_status, api_response_time_ms, error_message)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, jobTitle, apiStatus, apiResponseTimeMs ?? null, errorMessage ?? null);
}

export function saveQuestions(
  searchId: string,
  questions: QuestionResponse[]
): void {
  const database = _getDb();
  const stmt = database.prepare(`
    INSERT INTO interview_questions (id, search_id, question_text, focus_area, what_it_seeks, question_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertMany = database.transaction((questions: QuestionResponse[]) => {
    questions.forEach((q, index) => {
      stmt.run(uuidv4(), searchId, q.question, q.focus_area, q.what_it_seeks, index + 1);
    });
  });

  insertMany(questions);
}

export function getQuestionsBySearchId(
  searchId: string
): InterviewQuestion[] {
  const database = _getDb();
  const stmt = database.prepare(`
    SELECT * FROM interview_questions
    WHERE search_id = ?
    ORDER BY question_order ASC
  `);
  return stmt.all(searchId) as InterviewQuestion[];
}

export function getSearches(limit = 10, offset = 0): JobSearch[] {
  const database = _getDb();
  const stmt = database.prepare(`
    SELECT * FROM job_searches
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(limit, offset) as JobSearch[];
}

export function getSearchById(id: string): JobSearch | undefined {
  const database = _getDb();
  const stmt = database.prepare(`SELECT * FROM job_searches WHERE id = ?`);
  return stmt.get(id) as JobSearch | undefined;
}

export function getTotalSearchCount(): number {
  const database = _getDb();
  const stmt = database.prepare(`SELECT COUNT(*) as count FROM job_searches`);
  const result = stmt.get() as { count: number };
  return result.count;
}