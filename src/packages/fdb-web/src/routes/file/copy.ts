import { createRoute } from "../../main";

export default createRoute(
	(c) => {
		return c.text("copy");
	},
	{
		summary: "Copy File",
		tags: ["File"],
	},
);
