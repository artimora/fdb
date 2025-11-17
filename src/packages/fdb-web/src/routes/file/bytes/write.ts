import { createRoute } from "../../../main";

export default createRoute(
	(c) => {
		return c.text("write");
	},
	{
		summary: "Write Bytes",
		tags: ["File (Bytes)"],
	},
);
