<script lang="ts">
	import { resolve } from "$app/paths";
	import { exercises } from "$lib/stores/exercises";

	const programCount = $derived(
		($exercises ?? []).filter((ex) => {
			if (ex.type !== "exercise" || !ex.steps) return false;
			const currentIndex = ex.current_step_index ?? 0;
			return currentIndex < ex.steps.length;
		}).length,
	);
</script>

<section class="cta-card ios-card">
	<h2 class="cta-title">Inizia sessione</h2>
	{#if programCount > 0}
		<p class="cta-sub">
			{programCount} esercizi nel programma di oggi
		</p>
		<a href={resolve("/training")} class="btn btn--primary cta-btn">
			Registra sessione
		</a>
	{:else}
		<p class="cta-sub">
			Nessun esercizio in programma. Completa gli step dagli esercizi.
		</p>
		<a href={resolve("/exercises")} class="btn btn--secondary cta-btn">
			Vai agli esercizi
		</a>
	{/if}
</section>

<style>
	.cta-card {
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem;
		background: linear-gradient(
			145deg,
			var(--color-accent-dim) 0%,
			var(--color-card) 55%
		);
	}

	.cta-title {
		margin: 0;
		font-size: 1.375rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.cta-sub {
		margin: 0;
		font-size: 0.9375rem;
		color: var(--color-muted);
		line-height: 1.4;
	}

	.cta-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		width: 100%;
		padding: 0.875rem 1.25rem;
		font-size: 1rem;
		border-radius: 12px;
		margin-top: 0.25rem;
	}
</style>
