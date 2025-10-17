import { Database } from "bun:sqlite";

// JSONファイルから初期データを読み込む
const seedData = await Bun.file("./db/seed-data.json").json();

// サンプルデータの投入（既存のDBに対して実行）
const db = new Database("quiz.db");

// Prepared statements
const insertGroup = db.prepare(
  "INSERT INTO groups (group_id, name, description) VALUES (?, ?, ?)",
);
const insertQuestion = db.prepare(
  "INSERT INTO questions (group_id, question_id, question_text) VALUES (?, ?, ?)",
);
const insertChoice = db.prepare(
  "INSERT INTO choices (question_id, choice_text, is_correct, choice_order) VALUES (?, ?, ?, ?)",
);
const insertExplanation = db.prepare(
  "INSERT INTO explanations (question_id, explanation_text) VALUES (?, ?)",
);

// JSONデータからグループと問題を投入
let totalQuestions = 0;
let totalChoices = 0;
let totalGroups = 0;

for (const item of seedData) {
  // グループを投入
  const groupResult = insertGroup.run(
    item.group.id,
    item.group.name,
    item.group.description,
  );
  const groupId = groupResult.lastInsertRowid;
  totalGroups++;

  // グループに属する問題を投入
  for (const question of item.questions) {
    const questionResult = insertQuestion.run(
      groupId,
      question.id,
      question.question_text,
    );
    const questionId = questionResult.lastInsertRowid;
    totalQuestions++;

    // 選択肢を投入
    for (const choice of question.choices) {
      insertChoice.run(
        questionId,
        choice.choice_text,
        choice.is_correct,
        choice.choice_order,
      );
      totalChoices++;
    }

    // 解説を投入
    insertExplanation.run(questionId, question.explanation);
  }
}

console.log("✓ サンプルデータを投入しました");
console.log(`  - グループ数: ${totalGroups}`);
console.log(`  - 問題数: ${totalQuestions}`);
console.log(`  - 選択肢数: ${totalChoices}（各問題4つ）`);
console.log(`  - 解説数: ${totalQuestions}`);

db.close();
