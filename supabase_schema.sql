-- Create job_searches table
CREATE TABLE job_searches (
    id UUID PRIMARY KEY,
    job_title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    api_response_time_ms INTEGER,
    api_status TEXT,
    error_message TEXT
);

-- Create interview_questions table
CREATE TABLE interview_questions (
    id UUID PRIMARY KEY,
    search_id UUID NOT NULL REFERENCES job_searches(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    focus_area TEXT,
    what_it_seeks TEXT,
    question_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create logs table
CREATE TABLE logs (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level TEXT,
    category TEXT,
    message TEXT,
    metadata JSONB,
    user_session_id UUID
);

-- Create index for faster lookups
CREATE INDEX idx_interview_questions_search_id ON interview_questions(search_id);
CREATE INDEX idx_job_searches_created_at ON job_searches(created_at DESC);
