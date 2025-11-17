import { createRoute } from "../../main";

export default createRoute(
	(c) => {
		return c.text("exists");
	},
	{
		summary: "File Exists",
		tags: ["File"],
	},
);
