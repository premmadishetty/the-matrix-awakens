-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- THE MATRIX AWAKENS — D1 Database Schema (Full)
-- Run: npm run db:init:remote
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- [VISITS]: Every page load — browser, device, session, clicks
CREATE TABLE IF NOT EXISTS visits (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address          TEXT,
  city                TEXT,
  country             TEXT,
  browser             TEXT,
  device              TEXT,
  referer             TEXT,
  session_duration_ms INTEGER DEFAULT 0,
  click_count         INTEGER DEFAULT 0,
  click_targets       TEXT,   -- JSON array of what they clicked
  timestamp           INTEGER -- Unix ms
);

-- [KARMA_LOGS]: Every Sentinel chat session — full audit trail
CREATE TABLE IF NOT EXISTS karma_logs (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address            TEXT,
  city                  TEXT,
  country               TEXT,
  user_agent            TEXT,
  browser               TEXT,
  device                TEXT,
  referer               TEXT,
  prompt_history        TEXT,   -- JSON array [{role, content, timestamp}]
  neural_response       TEXT,
  message_count         INTEGER DEFAULT 0,
  conversation_summary  TEXT,   -- Auto-generated first→last message summary
  session_duration_ms   INTEGER DEFAULT 0,
  click_count           INTEGER DEFAULT 0,
  click_targets         TEXT,   -- JSON array
  is_high_intent        INTEGER DEFAULT 0,  -- 1 = high intent detected
  timestamp             INTEGER -- Unix ms
);

-- [LEAD_SOULS]: Contact form submissions
CREATE TABLE IF NOT EXISTS lead_souls (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  message   TEXT NOT NULL,
  source    TEXT DEFAULT 'contact_form',
  timestamp INTEGER -- Unix ms
);

-- [ERROR_LOGS]: API failures, DB errors, rate limits
CREATE TABLE IF NOT EXISTS error_logs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  error_type   TEXT,   -- API_ERROR, DB_ERROR, RATE_LIMIT, TRACK_ERROR
  endpoint     TEXT,
  ip_address   TEXT,
  message      TEXT,
  status_code  INTEGER,
  timestamp    INTEGER -- Unix ms
);

-- [RATE_LIMITS]: Throttle tracking per IP
CREATE TABLE IF NOT EXISTS rate_limits (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_address TEXT NOT NULL,
  timestamp  INTEGER NOT NULL
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_visits_ts        ON visits     (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_karma_ts         ON karma_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_karma_intent     ON karma_logs (is_high_intent);
CREATE INDEX IF NOT EXISTS idx_leads_ts         ON lead_souls (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_errors_ts        ON error_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ratelimit_ip_ts  ON rate_limits(ip_address, timestamp);
