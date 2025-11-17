import { createRoute } from "../../../types";

export default createRoute(
	(c) => {
		return c.text("append");
	},
	{
		tags: ["bytes"],
	},
);
