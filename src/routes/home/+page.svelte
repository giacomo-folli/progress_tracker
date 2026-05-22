<script lang="ts">
	import { resolve } from "$app/paths";
	import ActivityWeek from "$lib/components/home/ActivityWeek.svelte";
	import HomeStats from "$lib/components/home/HomeStats.svelte";
	import SessionCadence from "$lib/components/home/SessionCadence.svelte";
	import StartSessionCard from "$lib/components/home/StartSessionCard.svelte";
</script>

<main class="page home-page">
	<header class="home-header">
		<h1 class="large-title">Home</h1>
		<p class="page-subtitle">Il tuo riepilogo allenamento</p>
	</header>

	<ActivityWeek />
	<StartSessionCard />
	<HomeStats />
	<SessionCadence />

	<p class="analytics-link">
		<a href={resolve("/analytics")}>Vedi analisi complete →</a>
	</p>
</main>

<style>
	.home-page {
		padding-bottom: 0.5rem;
	}

	.home-header {
		margin-bottom: 1.25rem;
	}

	.analytics-link {
		margin: 0 0 1rem;
		text-align: center;
	}

	.analytics-link a {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-accent);
		text-decoration: none;
	}

	.analytics-link a:hover {
		text-decoration: underline;
	}
</style>
