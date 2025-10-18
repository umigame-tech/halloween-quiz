import { useState, useEffect, useRef } from "react";
import seedData from "../../db/seed-data.json";
import halloweenBg from "../halloween_bg.webp";
import { useNavigate } from "../hooks/useNavigate";

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
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState<string>("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizGroup, setQuizGroup] = useState<QuizGroup | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Convert URLs in text to clickable links
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Load quiz data from URL parameters
  const loadQuizData = () => {
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

    // Reset to expanded state when navigating
    setIsExpanded(true);
  };

  useEffect(() => {
    loadQuizData();

    // Listen for navigation events
    const handlePopState = () => {
      loadQuizData();
    };

    window.addEventListener("popstate", handlePopState);

    // Prevent body scroll on iOS
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100vh";

    // Focus on bottom sheet after a short delay to ensure it's rendered
    setTimeout(() => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.focus();
      }
    }, 100);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // Restore body scroll
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  const handleClose = () => {
    window.location.href = `/result?groupId=${groupId}`;
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!quizGroup) return;

    if (questionIndex < quizGroup.questions.length - 1) {
      // SPA navigation for next question
      navigate("/explanation", {
        groupId,
        questionIndex: (questionIndex + 1).toString(),
      });
    } else {
      // Regular navigation back to result
      window.location.href = `/result?groupId=${groupId}`;
    }
  };

  const handleBackgroundClick = () => {
    setIsExpanded(false);
  };

  const handleBottomSheetClick = (isExpanded: boolean) => {
    setIsExpanded(!isExpanded);
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Prevent pull-to-refresh on main container
  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    if (!mainContainer) return;

    const preventPullToRefresh = (e: TouchEvent) => {
      // Prevent pull-to-refresh by stopping default touch behavior
      e.preventDefault();
    };

    mainContainer.addEventListener("touchmove", preventPullToRefresh, {
      passive: false,
    });

    return () => {
      mainContainer.removeEventListener("touchmove", preventPullToRefresh);
    };
  }, []);

  // Set up native touch event listeners to prevent scroll
  useEffect(() => {
    const element = bottomSheetRef.current;
    if (!element) return;

    let startY: number | null = null;
    let endY: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      endY = null;
      startY = e.touches[0].clientY;
      setTouchStart(startY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default to stop background scrolling
      e.preventDefault();
      endY = e.touches[0].clientY;
      setTouchEnd(endY);
    };

    const handleTouchEnd = () => {
      if (!startY || !endY) return;

      const distance = startY - endY;
      const isUpSwipe = distance > minSwipeDistance;
      const isDownSwipe = distance < -minSwipeDistance;

      if (isUpSwipe && !isExpanded) {
        setIsExpanded(true);
      } else if (isDownSwipe && isExpanded) {
        setIsExpanded(false);
      }

      startY = null;
      endY = null;
    };

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isExpanded, minSwipeDistance]);

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
      ref={mainContainerRef}
      className="relative flex flex-col px-4 py-6 text-white"
      style={{
        backgroundColor: "#191022",
        height: "100vh",
        overflow: "hidden",
        touchAction: "none",
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
        ref={bottomSheetRef}
        tabIndex={0}
        className="fixed bottom-0 left-0 right-0 bg-[#2a1a3e] rounded-t-3xl pb-6 px-6 flex flex-col z-30 overflow-hidden"
        style={{
          maxHeight: isExpanded ? "60vh" : "180px",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          outline: "none",
        }}
      >
        <div
          className="flex items-center mb-4 cursor-pointer pt-6"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleBottomSheetClick(isExpanded);
          }}
        >
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
          <span className="ml-2 text-sm">
            {isExpanded ? "閉じる" : "解説を見る"}
          </span>
        </div>

        <div
          style={{
            flexGrow: isExpanded ? 1 : 0,
            opacity: isExpanded ? 1 : 0,
            overflow: "hidden",
            transition:
              "flex-grow 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            className="overflow-y-auto pr-2"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <h2 className="text-xl font-bold mb-2">解説</h2>
            <p className="text-base leading-relaxed whitespace-pre-line">
              {renderTextWithLinks(currentQuestion.explanation)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-600">
          <button
            onClick={handleNext}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg cursor-pointer"
          >
            {isLastQuestion ? "クイズ結果に戻る" : "次の問題へ"}
          </button>
        </div>
      </div>
    </div>
  );
}
