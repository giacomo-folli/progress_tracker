import { resolve } from "$app/paths";
import { redirect } from "@sveltejs/kit";

export const load = async () => {
	throw redirect(307, resolve("/training"));
};
