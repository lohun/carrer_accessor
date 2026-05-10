import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";
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
      const { error } = await supabase.from("logs").insert({
        id: logEntry.id,
        timestamp: logEntry.timestamp,
        level: logEntry.level,
        category: logEntry.category,
        message: logEntry.message,
        metadata: logEntry.metadata || {},
        user_session_id: logEntry.user_session_id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Failed to write log to Supabase:", error);
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const logger = new Logger();