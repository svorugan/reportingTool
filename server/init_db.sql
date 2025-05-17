-- Table: datasources
CREATE TABLE IF NOT EXISTS datasources (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'postgres', 'oracle', 'snowflake', 'rest_api'
    config JSONB NOT NULL, -- Stores connection details as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: report_definitions
CREATE TABLE IF NOT EXISTS report_definitions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    datasource_id INTEGER NOT NULL REFERENCES datasources(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
