import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Synthesis } from "./Systems/Synthesis.ts";
import { api } from "./Systems/api.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);

api.test_server();
Synthesis.init();
