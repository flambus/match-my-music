/**
 * Backend entrypoint:
 * This module provides a default export that defines the UI that is returned from the backend
 * when a page is visited
 */
import { provideRedirect } from "uix/providers/common.tsx";
import { type Entrypoint } from "uix/providers/entrypoints.ts";
import { getUser } from "backend/users.ts";
import { Routes } from "common/routes.ts";

export default {
	// show backend (hybrid) rendered page on /backend
	'/backend': import("common/page.tsx"), 
	'/': provideRedirect(Routes.MATCH_MY_MUSIC),

	[Routes.MATCH_MY_MUSIC]: async (context) => {
		const user = await getUser( await context.getPrivateData());
		if (user === null) return provideRedirect(Routes.LOGIN);
		else return <main>
		<h1>{user.first_name}</h1> 
		</main>;
	}

} satisfies Entrypoint;
