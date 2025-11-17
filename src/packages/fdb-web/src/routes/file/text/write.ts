import { createRoute } from "../../../main";

export default createRoute(
	(c) => {
		return c.text("write");
	},
	{
		summary: "Write Text",
		tags: ["File (Text)"],
	},
);
