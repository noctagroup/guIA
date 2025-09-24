CREATE TABLE IF NOT EXISTS projeto_search_index (
  projeto_id BIGINT PRIMARY KEY REFERENCES projetos(id) ON DELETE CASCADE,
  text      TEXT NOT NULL,
  embedding vector(768) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_proj_search_hnsw
  ON projeto_search_index USING hnsw (embedding vector_cosine_ops);
