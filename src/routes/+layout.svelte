<script lang="ts">
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";
	import { pwaInfo } from "virtual:pwa-info";
	import { onMount, type Snippet } from "svelte";
	import { supabase } from "$lib/supabase";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	let pwaWebManifest = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

	onMount(() => {
		if (pwaInfo) {
			import("virtual:pwa-register").then(({ registerSW }) => {
				registerSW({ immediate: true });
			});
		}

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			const currentRoute = page.url.pathname;
			const isSignedIn = !!session;

			if (!isSignedIn) goto(resolve("/auth"));
			else if (currentRoute.includes("/auth")) goto(resolve("/training"));
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<!-- Inietta il tag del manifest generato da Vite -->
	{@html pwaWebManifest}

	<script
		async
		src="https://cdn.jsdelivr.net/npm/pwacompat"
		crossorigin="anonymous"
	></script>
</svelte:head>

<div class="shell">
	<Nav />
	{@render children()}
</div>

<style>
	.shell {
		max-width: 960px;
		margin: 0 auto;
		padding: 1.25rem 1rem 4rem;

		overflow-y: auto;
		height: 100%;
		-webkit-overflow-scrolling: touch;
	}

	@media (min-width: 600px) {
		.shell {
			padding: 2rem 1.5rem 4rem;
		}
	}
</style>
