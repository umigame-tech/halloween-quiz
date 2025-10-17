import { useState, useEffect } from "react";
import seedData from "../../db/seed-data.json";

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

export function Quiz() {
  const [groupId, setGroupId] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [quizGroup, setQuizGroup] = useState<QuizGroup | null>(null);

  useEffect(() => {
    // Get groupId from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const id = params.get("groupId");
    if (id) {
      setGroupId(id);
      const group = (seedData as QuizGroup[]).find((g) => g.group.id === id);
      if (group) {
        setQuizGroup(group);
        // Load saved answers if any
        const savedAnswers = sessionStorage.getItem(`quiz_${id}`);
        if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
        }
      }
    }
  }, []);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Time's up, move to next question
      handleTimeUp();
    }
  }, [timeLeft]);

  const handleTimeUp = () => {
    if (!quizGroup) return;

    const currentQuestion = quizGroup.questions[currentQuestionIndex];
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedChoice: "",
      isCorrect: false,
      timeSpent: 30,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    sessionStorage.setItem(`quiz_${groupId}`, JSON.stringify(updatedAnswers));

    moveToNextQuestion();
  };

  const handleAnswerSelect = (choiceText: string, isCorrect: boolean) => {
    if (!quizGroup) return;

    const currentQuestion = quizGroup.questions[currentQuestionIndex];
    const timeSpent = 30 - timeLeft;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedChoice: choiceText,
      isCorrect: isCorrect,
      timeSpent: timeSpent,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    sessionStorage.setItem(`quiz_${groupId}`, JSON.stringify(updatedAnswers));

    // Wait a bit before moving to next question
    setTimeout(() => {
      moveToNextQuestion();
    }, 500);
  };

  const moveToNextQuestion = () => {
    if (!quizGroup) return;

    if (currentQuestionIndex < quizGroup.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    } else {
      // Quiz finished, redirect to results page (TODO)
      alert("Quiz finished! Results page coming soon...");
      window.location.href = "/quiz-list";
    }
  };

  const handleClose = () => {
    if (confirm("クイズを終了しますか？進捗は保存されません。")) {
      sessionStorage.removeItem(`quiz_${groupId}`);
      window.location.href = "/quiz-list";
    }
  };

  if (!quizGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#48286A]">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  const currentQuestion = quizGroup.questions[currentQuestionIndex];
  const progress = ((timeLeft / 30) * 100);
  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = quizGroup.questions.length;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-x-hidden bg-[#48286A]">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex size-12 shrink-0 items-center cursor-pointer" onClick={handleClose}>
          <span className="material-symbols-outlined text-white text-3xl">
            close
          </span>
        </div>
        <h2 className="text-white text-3xl font-bold leading-tight tracking-wider flex-1 text-center" style={{ fontFamily: "var(--font-family-display)" }}>
          Halloween Quiz
        </h2>
        <div className="flex w-12 items-center justify-end">
          <p className="text-white/80 text-base font-bold leading-normal tracking-[0.015em] shrink-0">
            {questionNumber}/{totalQuestions}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-end">
          <p className="text-white/80 text-sm font-normal leading-normal">{timeLeft}s</p>
        </div>
        <div className="rounded-full bg-white/20">
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              backgroundColor: "#FFA500"
            }}
          ></div>
        </div>
      </div>

      <h1 className="text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
        {currentQuestion.question_text}
      </h1>

      <div className="flex justify-center mt-8">
        <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
          {currentQuestion.choices
            .sort((a, b) => a.choice_order - b.choice_order)
            .map((choice, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(choice.choice_text, choice.is_correct)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] w-full transition-transform hover:scale-105"
                style={{
                  backgroundColor: "#FFA500",
                  color: "#48286A"
                }}
              >
                <span className="truncate">{choice.choice_text}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="h-5"></div>
    </div>
  );
}
