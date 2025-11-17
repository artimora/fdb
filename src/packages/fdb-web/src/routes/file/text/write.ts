import { createRoute } from "../../../types";

export default createRoute(
	(c) => {
		return c.text("write");
	},
	{
		tags: ["text"],
	},
);
