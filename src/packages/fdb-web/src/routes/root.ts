import { createRoute } from "../main";

export default createRoute(
	(c) => {
		return c.text("fdb");
	},
	{
		summary: "Root",
		tags: ["Base"],
	},
);
