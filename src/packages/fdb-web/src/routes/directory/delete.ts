import { createRoute } from "../../main";

export default createRoute(
	(c) => {
		return c.text("delete");
	},
	{
		tags: ["directory"],
	},
);
