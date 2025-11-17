import { createRoute } from "../../../main";

export default createRoute(
	(c) => {
		return c.text("append");
	},
	{
		summary: "Append",
		tags: ["File (Bytes)"],
	},
);
