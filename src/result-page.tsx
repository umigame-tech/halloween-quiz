import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Result } from "./components/Result";
import "./index.css";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <Result />
  </StrictMode>
);

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  createRoot(elem).render(app);
}
