-- Crear tabla arc_sessions para guardar respuestas de cada día
CREATE TABLE IF NOT EXISTS arc_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7),
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(day, user_id)
);

-- Crear tabla arc_diagnostics para guardar diagnósticos generados
CREATE TABLE IF NOT EXISTS arc_diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  day INTEGER DEFAULT 7,
  pattern TEXT NOT NULL,
  contradiction TEXT NOT NULL,
  decision TEXT NOT NULL,
  cost TEXT NOT NULL,
  alignment_score INTEGER CHECK (alignment_score >= 0 AND alignment_score <= 100),
  friction_index NUMERIC(3,1) CHECK (friction_index >= 0 AND friction_index <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla arc_chat para guardar conversaciones con ARC
CREATE TABLE IF NOT EXISTS arc_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id UUID NOT NULL,
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_arc_sessions_user_id ON arc_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_arc_sessions_day ON arc_sessions(day);
CREATE INDEX IF NOT EXISTS idx_arc_diagnostics_user_id ON arc_diagnostics(user_id);
CREATE INDEX IF NOT EXISTS idx_arc_diagnostics_created_at ON arc_diagnostics(created_at);
CREATE INDEX IF NOT EXISTS idx_arc_chat_user_id ON arc_chat(user_id);
CREATE INDEX IF NOT EXISTS idx_arc_chat_session_id ON arc_chat(session_id);

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE arc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arc_diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE arc_chat ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acceso anónimo (sin user_id)
-- Permitir lectura/escritura si no hay user_id (sesión anónima)
CREATE POLICY "arc_sessions_anon_access" ON arc_sessions
  FOR ALL
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

CREATE POLICY "arc_diagnostics_anon_access" ON arc_diagnostics
  FOR ALL
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

CREATE POLICY "arc_chat_anon_access" ON arc_chat
  FOR ALL
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

-- Políticas RLS para acceso autenticado
-- Permitir lectura/escritura solo de datos propios
CREATE POLICY "arc_sessions_user_access" ON arc_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "arc_diagnostics_user_access" ON arc_diagnostics
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "arc_chat_user_access" ON arc_chat
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
