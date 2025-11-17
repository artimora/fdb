import { createRoute } from "../../types";

export default createRoute(
	(c) => {
		return c.text("create");
	},
	{
		tags: ["file"],
	},
);
