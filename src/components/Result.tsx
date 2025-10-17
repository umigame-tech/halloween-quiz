import { useState, useEffect } from "react";
import seedData from "../../db/seed-data.json";
import halloweenResultBg from "../halloween_result.png";

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

interface UserAnswer {
  questionId: string;
  selectedChoice: string;
  isCorrect: boolean;
  timeSpent: number;
}

export function Result() {
  const [groupId, setGroupId] = useState<string>("");
  const [quizGroup, setQuizGroup] = useState<QuizGroup | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Get groupId from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const id = params.get("groupId");
    if (id) {
      setGroupId(id);
      const group = (seedData as QuizGroup[]).find((g) => g.group.id === id);
      if (group) {
        setQuizGroup(group);

        // Load answers from sessionStorage
        const savedAnswers = sessionStorage.getItem(`quiz_${id}`);
        if (savedAnswers) {
          const parsedAnswers: UserAnswer[] = JSON.parse(savedAnswers);
          setAnswers(parsedAnswers);

          // Calculate correct count
          const correct = parsedAnswers.filter((a) => a.isCorrect).length;
          setCorrectCount(correct);

          // Calculate score (10 points per question)
          const calculatedScore = correct * 10;
          setScore(calculatedScore);
        }
      }
    }
  }, []);

  const handleClose = () => {
    if (groupId) {
      sessionStorage.removeItem(`quiz_${groupId}`);
    }
    window.location.href = "/quiz-list";
  };

  const handleRetry = () => {
    if (groupId) {
      sessionStorage.removeItem(`quiz_${groupId}`);
    }
    window.location.href = "/quiz-list";
  };

  const getMessage = () => {
    if (!quizGroup) return "";
    const percentage = (correctCount / quizGroup.questions.length) * 100;

    if (percentage >= 80) {
      return "すごい！ハロウィンマスターだね！";
    } else if (percentage >= 50) {
      return "いい感じ！ハロウィンエンジョイ勢だね！";
    } else {
      return "もう少し！ハロウィン勉強中だね！";
    }
  };

  const getShareText = () => {
    if (!quizGroup) return "";
    const url = location.protocol + "//" + location.host;
    return encodeURIComponent(
      `【${quizGroup.group.name}】のクイズで${score}点を獲得しました！ #ハロウィンクイズ ${url}`,
    );
  };

  const handleTwitterShare = () => {
    const text = getShareText();
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleThreadsShare = () => {
    const text = getShareText();
    window.open(`https://www.threads.net/intent/post?text=${text}`, "_blank");
  };

  if (!quizGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1E1E1E]">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#1E1E1E] dark group/design-root overflow-x-hidden">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div
          className="text-white flex size-12 shrink-0 items-center justify-center cursor-pointer"
          onClick={handleClose}
        >
          <span className="material-symbols-outlined">close</span>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          クイズ結果
        </h2>
      </div>

      <div className="flex w-full grow bg-[#1E1E1E] @container p-4 justify-center items-center">
        <div className="w-full max-w-sm gap-1 overflow-hidden bg-[#1E1E1E] @[480px]:gap-2 aspect-[2/3] rounded-xl flex">
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
            style={{
              backgroundImage: `url(${halloweenResultBg})`,
            }}
          ></div>
        </div>
      </div>

      <h1 className="text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
        {getMessage()}
      </h1>
      <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
        {quizGroup.questions.length}問中{correctCount}問正解！
      </p>
      <h1
        className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-center pb-3 pt-5"
        style={{ color: "#FFD700" }}
      >
        あなたのスコアは{score}点！
      </h1>

      <div className="flex flex-col items-center gap-4 px-4 py-8">
        <button
          onClick={handleRetry}
          className="w-full max-w-sm font-bold py-3 px-4 rounded-lg text-lg text-white"
          style={{ backgroundColor: "#FF7F50" }}
        >
          もう一度挑戦
        </button>

        <div className="flex w-full max-w-sm gap-4">
          <button
            onClick={handleTwitterShare}
            className="flex-1 bg-gray-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            Xでシェア
          </button>
          <button
            onClick={handleThreadsShare}
            className="flex-1 bg-gray-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            Threadsでシェア
          </button>
        </div>
      </div>
    </div>
  );
}
