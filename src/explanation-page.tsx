import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Explanation } from "./components/Explanation";
import "./index.css";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <Explanation />
  </StrictMode>
);

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  createRoot(elem).render(app);
}
