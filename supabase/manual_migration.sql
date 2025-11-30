-- ================================================
-- AI Campus - 수동 마이그레이션 스크립트
-- Supabase SQL Editor에서 실행하세요
-- ================================================

-- 1. sandbox_usage 테이블
CREATE TABLE IF NOT EXISTS sandbox_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_sandbox_usage_user_date ON sandbox_usage(user_id, usage_date);

ALTER TABLE sandbox_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" ON sandbox_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON sandbox_usage FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON sandbox_usage FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 2. conversations 테이블
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '새 대화',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. messages 테이블
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 인덱스
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- 5. RLS 정책
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid()));
CREATE POLICY "Users can insert messages in own conversations" ON messages FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid()));

-- 6. 트리거 (대화 updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();
