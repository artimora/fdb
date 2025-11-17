import { createRoute } from "../../../types";

export default createRoute(
	(c) => {
		return c.text("read");
	},
	{
		tags: ["text"],
	},
);
