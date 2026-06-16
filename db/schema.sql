-- ============================================================
-- Yoga App (Serenity) — Database Schema
-- Neon PostgreSQL 18+ with RLS enabled
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables for clean database setup
DROP TABLE IF EXISTS notification_settings CASCADE;
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- 1. USERS / PROFILES
-- Stores personal onboarding info, wellness targets, and BMI.
-- User ID is a BIGINT provided by external handshake.
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                BIGINT PRIMARY KEY,
  name              TEXT NOT NULL,
  age               INTEGER,
  gender            TEXT,
  height            NUMERIC,
  weight            NUMERIC,
  experience        TEXT,
  goals             TEXT[] NOT NULL DEFAULT '{}',
  practices         TEXT[] NOT NULL DEFAULT '{}',
  skill_level       TEXT,
  restrictions      TEXT[] NOT NULL DEFAULT '{}',
  daily_time        TEXT,
  practice_time     TEXT,
  equipment         TEXT[] NOT NULL DEFAULT '{}',
  weekly_commitment TEXT,
  motivations       TEXT[] NOT NULL DEFAULT '{}',
  bmi               NUMERIC,
  bmi_category      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. SESSIONS (PRACTICE LOGS)
-- Tracks completed exercises (yoga, meditation, breathwork, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id               TEXT PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date             DATE NOT NULL,
  title            TEXT NOT NULL,
  category         TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. HABITS
-- User defined daily habit trackers
-- ============================================================
CREATE TABLE IF NOT EXISTS habits (
  id         TEXT PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  emoji      TEXT,
  streak     INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
  done       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. JOURNAL ENTRIES
-- Wellness journal entries and gratitude items list
-- ============================================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('journal', 'gratitude')),
  content    TEXT,
  items      TEXT[] NOT NULL DEFAULT '{}',
  entry_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. NOTIFICATION SETTINGS
-- User notification configurations
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_settings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  master_notif BOOLEAN NOT NULL DEFAULT TRUE,
  settings     JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- INDEXES
-- Optimize lookups on date columns for calendar/stats views
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO notification_settings (user_id, master_notif, settings)
VALUES (10000001, TRUE, '[
  {"id": "yoga", "label": "Yoga Session", "description": "Remind me to practice yoga", "emoji": "🧘", "enabled": true, "time": "07:00"},
  {"id": "meditation", "label": "Meditation", "description": "Daily mindfulness reminder", "emoji": "🧠", "enabled": true, "time": "08:00"},
  {"id": "breathwork", "label": "Breathwork", "description": "Breathing exercise reminder", "emoji": "🌬️", "enabled": false, "time": "09:00"},
  {"id": "water", "label": "Hydration", "description": "Drink water reminders throughout day", "emoji": "💧", "enabled": true, "time": "10:00"},
  {"id": "sleep", "label": "Wind-Down", "description": "Evening relaxation reminder", "emoji": "🌙", "enabled": false, "time": "21:30"},
  {"id": "progress", "label": "Log Session", "description": "Remind to log today''s practice", "emoji": "📊", "enabled": false, "time": "20:00"}
]'::jsonb)
ON CONFLICT (user_id) DO NOTHING;
