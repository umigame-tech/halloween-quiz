import { useState, useEffect } from "react";
import seedData from "../../db/seed-data.json";
import halloweenBg from "../halloween_bg.webp";

interface Question {
  id: string;
  question_text: string;
  explanation: string;
  choices: Array<{
    choice_text: string;
    is_correct: boolean;
    choice_order: number;
  }>;
}

interface QuizGroup {
  group: {
    id: string;
    name: string;
    description: string;
  };
  questions: Question[];
}

interface UserAnswer {
  questionId: string;
  selectedChoice: string;
  isCorrect: boolean;
  timeSpent: number;
}

export function Explanation() {
  const [groupId, setGroupId] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizGroup, setQuizGroup] = useState<QuizGroup | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Get groupId and questionIndex from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const id = params.get("groupId");
    const index = params.get("questionIndex");

    if (id) {
      setGroupId(id);
      const group = (seedData as QuizGroup[]).find((g) => g.group.id === id);
      if (group) {
        setQuizGroup(group);

        // Load answers from sessionStorage
        const savedAnswers = sessionStorage.getItem(`quiz_${id}`);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
      }

      if (index) {
        setQuestionIndex(parseInt(index, 10));
      }
    }
  }, []);

  const handleClose = () => {
    window.location.href = `/result?groupId=${groupId}`;
  };

  const handleNext = () => {
    if (!quizGroup) return;

    if (questionIndex < quizGroup.questions.length - 1) {
      window.location.href = `/explanation?groupId=${groupId}&questionIndex=${questionIndex + 1}`;
    } else {
      window.location.href = `/result?groupId=${groupId}`;
    }
  };

  const handleBackgroundClick = () => {
    setIsExpanded(false);
  };

  const handleBottomSheetClick = (isExpanded: boolean) => {
    setIsExpanded(!isExpanded);
  };

  if (!quizGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#191022]">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const currentQuestion = quizGroup.questions[questionIndex];
  const userAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const isLastQuestion = questionIndex === quizGroup.questions.length - 1;

  return (
    <div
      className="relative min-h-screen flex flex-col px-4 py-6 text-white"
      style={{
        backgroundColor: "#191022",
      }}
    >
      <div className="absolute top-4 left-4 z-10">
        <div
          className="flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full w-10 h-10 cursor-pointer"
          onClick={handleClose}
        >
          <span className="material-symbols-outlined text-white">close</span>
        </div>
      </div>

      <div className="relative flex-grow flex flex-col justify-center items-center text-center">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <span className="bg-purple-600 text-sm font-bold px-4 py-1 rounded-full">
              第{questionIndex + 1}問
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-6">
            {currentQuestion.question_text}
          </h1>
          <div className="space-y-4">
            {currentQuestion.choices
              .sort((a, b) => a.choice_order - b.choice_order)
              .map((choice, index) => {
                const isUserChoice =
                  userAnswer?.selectedChoice === choice.choice_text;
                const isCorrect = choice.is_correct;

                // 4つのパターンを区別
                let bgColor = "";
                let label = "";

                if (isCorrect && isUserChoice) {
                  // 正解かつユーザーが選択
                  bgColor = "bg-green-500";
                  label = " (あなたの回答・正解)";
                } else if (isCorrect && !isUserChoice) {
                  // 正解かつユーザーが選択していない
                  bgColor = "bg-orange-500";
                  label = " (正解)";
                } else if (!isCorrect && isUserChoice) {
                  // 不正解かつユーザーが選択
                  bgColor = "bg-red-500";
                  label = " (あなたの回答)";
                } else {
                  // 不正解かつユーザーが選択していない
                  bgColor = "bg-gray-700 bg-opacity-80";
                  label = "";
                }

                return (
                  <button
                    key={index}
                    disabled
                    className={`w-full ${bgColor} text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg`}
                  >
                    {choice.choice_text}
                    {label}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Darkening overlay when expanded - clickable to collapse */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={handleBackgroundClick}
        />
      )}

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#2a1a3e] rounded-t-3xl p-6 flex flex-col transition-all duration-300 z-30 ${
          isExpanded ? "h-3/5" : "h-auto"
        }`}
        onClick={() => handleBottomSheetClick(isExpanded)}
        style={{ cursor: isExpanded ? "default" : "pointer" }}
      >
        <div className="flex items-center mb-4">
          {userAnswer?.isCorrect ? (
            <>
              <span className="material-symbols-outlined text-green-400 text-4xl mr-2">
                task_alt
              </span>
              <span className="text-2xl font-bold text-green-400">正解！</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-red-400 text-4xl mr-2">
                cancel
              </span>
              <span className="text-2xl font-bold text-red-400">不正解</span>
            </>
          )}
          <span className="ml-2 text-sm">{isExpanded ? "" : "解説を見る"}</span>
        </div>

        {isExpanded && (
          <div
            className="flex-grow overflow-y-auto pr-2"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <h2 className="text-xl font-bold mb-2">解説</h2>
            <p className="text-base leading-relaxed whitespace-pre-line">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div
          className={`${isExpanded ? "mt-4 pt-4 border-t border-gray-600" : "mt-0"}`}
        >
          <button
            onClick={handleNext}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg"
          >
            {isLastQuestion ? "クイズ結果に戻る" : "次の問題へ"}
          </button>
        </div>
      </div>
    </div>
  );
}
