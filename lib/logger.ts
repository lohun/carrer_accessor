import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";
import type { LogEntry, LogCategory } from "./types";

class Logger {
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
  }

  async log(
    level: "INFO" | "ERROR" | "WARNING",
    category: LogCategory | string,
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const logEntry: LogEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      metadata,
      user_session_id: this.sessionId,
    };

    if (process.env.NODE_ENV === "development") {
      console.log(`[${level}] ${category}: ${message}`, metadata);
    }

    try {
      const database = getDb();
      database
        .prepare(
          `
        INSERT INTO logs (id, timestamp, level, category, message, metadata, user_session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
        )
        .run(
          logEntry.id,
          logEntry.timestamp,
          logEntry.level,
          logEntry.category,
          logEntry.message,
          JSON.stringify(logEntry.metadata || {}),
          logEntry.user_session_id
        );
    } catch (error) {
      console.error("Failed to write log to database:", error);
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const logger = new Logger();