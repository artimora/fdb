import { createRoute } from "../../main";

export default createRoute(
	(c) => {
		return c.text("delete");
	},
	{
		summary: "Delete File",
		tags: ["File"],
	},
);
