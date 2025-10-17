import { Database } from "bun:sqlite";

export interface Group {
  id: number;
  group_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Question {
  id: number;
  group_id: number;
  question_id: string;
  question_text: string;
  created_at: string;
}

export interface Choice {
  id: number;
  question_id: number;
  choice_text: string;
  is_correct: boolean;
  choice_order: number; // 1-4 for 四択
}

export interface Explanation {
  id: number;
  question_id: number;
  explanation_text: string;
}

export function initializeDatabase(dbPath: string = "quiz.db"): Database {
  const db = new Database(dbPath);

  // グループテーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 問題テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      question_id TEXT NOT NULL UNIQUE,
      question_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
    )
  `);

  // 選択肢テーブル（各問題に4つの選択肢）
  db.run(`
    CREATE TABLE IF NOT EXISTS choices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      choice_text TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL DEFAULT 0,
      choice_order INTEGER NOT NULL CHECK(choice_order BETWEEN 1 AND 4),
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE(question_id, choice_order)
    )
  `);

  // 解説テーブル
  db.run(`
    CREATE TABLE IF NOT EXISTS explanations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      explanation_text TEXT NOT NULL,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE(question_id)
    )
  `);

  // インデックスの作成
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_questions_group_id ON questions(group_id)`,
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_choices_question_id ON choices(question_id)`,
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_explanations_question_id ON explanations(question_id)`,
  );

  return db;
}
