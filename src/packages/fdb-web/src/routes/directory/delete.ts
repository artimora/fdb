import { createRoute } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	(c) => {
		return c.text("delete");
	},
	{
		summary: "Delete Directory",
		tags: ["Directory"],
	},
) satisfies APIRoute as APIRoute;
