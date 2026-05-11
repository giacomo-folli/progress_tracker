import { H as escape_html } from "../../chunks/dev.js";
import { t as page } from "../../chunks/state.js";
//#region node_modules/.pnpm/@sveltejs+kit@2.59.1_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5.55.5_vite@8.0.11__svel_3364b2e3a68b58d9d725bef73d04135c/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}
//#endregion
export { Error as default };
