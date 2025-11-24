import { createRoute } from "../../main";
import type { APIRoute } from "../../types";

export default createRoute(
	(c) => {
		return c.text("delete");
	},
	{
		summary: "Delete File",
		tags: ["File"],
	},
) satisfies APIRoute as APIRoute;
