import { initializeDatabase } from "./schema";

// DDLのみ実行（テーブル作成）
const db = initializeDatabase();
console.log("✓ データベースを初期化しました");
console.log("  - テーブル: questions, choices, explanations");
db.close();
