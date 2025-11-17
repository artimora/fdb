import { createRoute } from "../../main";

export default createRoute(
	(c) => {
		return c.text("move");
	},
	{
		summary: "Move File",
		tags: ["File"],
	},
);
