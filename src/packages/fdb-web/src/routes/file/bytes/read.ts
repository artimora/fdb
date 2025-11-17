import { createRoute } from "../../../main";

export default createRoute(
	(c) => {
		return c.text("read");
	},
	{
		summary: "Read Bytes",
		tags: ["File (Bytes)"],
	},
);
