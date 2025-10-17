import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Quiz } from "./components/Quiz";
import "./index.css";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <Quiz />
  </StrictMode>
);

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  createRoot(elem).render(app);
}
