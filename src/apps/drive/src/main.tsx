import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: documents gonna have a root
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
