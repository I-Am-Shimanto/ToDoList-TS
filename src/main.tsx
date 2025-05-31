import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { app } from "./dbconfig.ts";

createRoot(document.getElementById("root")!).render(<App />);
