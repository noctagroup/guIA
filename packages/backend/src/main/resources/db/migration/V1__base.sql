CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS projetos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  repositorio TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projeto_tecnologias (
  projeto_id BIGINT NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  tecnologia TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS equipes (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  curso TEXT NOT NULL,
  semestre TEXT NOT NULL,
  projeto_id BIGINT NOT NULL REFERENCES projetos(id)
);

CREATE TABLE IF NOT EXISTS equipe_integrantes (
  equipe_id BIGINT NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
  integrante TEXT NOT NULL
);
