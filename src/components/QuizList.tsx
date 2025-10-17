import { useState } from "react";
import seedData from "../../db/seed-data.json";

interface QuizGroup {
  group: {
    id: string;
    name: string;
    description: string;
  };
  questions: Array<{
    id: string;
    question_text: string;
    explanation: string;
    choices: Array<{
      choice_text: string;
      is_correct: boolean;
      choice_order: number;
    }>;
  }>;
}

const iconMap: { [key: string]: string } = {
  g001: "psychology",
  g002: "auto_awesome",
  g003: "military_tech",
  g004: "emoji_events",
};

export function QuizList() {
  const quizGroups = seedData as QuizGroup[];

  const handleStartQuiz = (groupId: string) => {
    console.log("Starting quiz for group:", groupId);
    // TODO: Navigate to quiz screen
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark group/design-root overflow-x-hidden">
      <div className="flex items-center bg-background-dark p-4 pb-2 justify-between">
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display">
          Halloween Quiz Challenge
        </h2>
      </div>
      <div className="h-5 bg-background-dark"></div>
      <div className="flex flex-col">
        {quizGroups.map((quizGroup) => (
          <div
            key={quizGroup.group.id}
            className="flex items-center gap-4 bg-background-dark px-4 min-h-[72px] py-2 justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="text-white flex items-center justify-center rounded-lg bg-[#302839] shrink-0 size-12">
                <span className="material-symbols-outlined">
                  {iconMap[quizGroup.group.id] || "help"}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white text-base font-medium leading-normal line-clamp-1 font-display">
                  {quizGroup.group.name}
                </p>
                <p className="text-[#ab9db9] text-sm font-normal leading-normal line-clamp-2 font-display">
                  {quizGroup.group.description}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => handleStartQuiz(quizGroup.group.id)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 text-white text-sm font-medium leading-normal w-fit font-display transition-transform duration-300 ease-in-out hover:scale-105"
                style={{ backgroundColor: "#7311d4" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#5f0eb8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#7311d4";
                }}
              >
                <span className="truncate">挑戦する</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
