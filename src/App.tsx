import { useState } from "react";
import { HalloweenQuiz } from "./components/HalloweenQuiz";
import { QuizList } from "./components/QuizList";
import "./index.css";

type Screen = "home" | "quiz-list" | "quiz";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  return (
    <>
      {currentScreen === "home" && (
        <HalloweenQuiz onStart={() => setCurrentScreen("quiz-list")} />
      )}
      {currentScreen === "quiz-list" && <QuizList />}
    </>
  );
}

export default App;
