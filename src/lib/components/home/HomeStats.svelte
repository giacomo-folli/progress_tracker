<script lang="ts">
	import { exercises } from "$lib/stores/exercises";
	import ProgressBar from "$lib/components/ProgressBar.svelte";
	import type { Step } from "$lib/types";

	const filteredExercises = $derived(
		$exercises.filter((e) => e.type === "exercise"),
	);

	const totalSteps = $derived(
		filteredExercises.reduce((s, ex) => s + Number(ex.steps?.length), 0),
	);
	const completedSteps = $derived(
		filteredExercises.reduce(
			(s, ex) => s + Number(ex.steps?.filter((st) => st.completed)?.length),
			0,
		),
	);
	const exercisesCompleted = $derived(
		filteredExercises.filter((ex) => ex.steps?.every((s) => s.completed)).length,
	);
	const exercisesInProgress = $derived(
		filteredExercises.filter(
			(ex) =>
				ex.steps?.some((s) => s.completed) &&
				!ex.steps?.every((s) => s.completed),
		).length,
	);

	const overallPercent = $derived(
		totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100),
	);

	const lastCompleted = $derived.by(() => {
		let latest: (Step & { exerciseName?: string }) | undefined;

		for (const ex of filteredExercises) {
			for (const step of ex.steps ?? []) {
				if (!step.completed_at) continue;
				if (
					!latest?.completed_at ||
					new Date(latest.completed_at) < new Date(step.completed_at)
				) {
					latest = { ...step, exerciseName: ex.name };
				}
			}
		}
		return latest;
	});

	const formattedDate = $derived(
		lastCompleted?.completed_at
			? new Date(lastCompleted.completed_at).toLocaleDateString("it-IT", {
					day: "numeric",
					month: "short",
				})
			: "",
	);
</script>

<section class="home-stats">
	<p class="ios-section-label">Programma</p>
	<div class="stats-grid">
		<div class="stat-tile ios-card">
			{#if lastCompleted}
				<span class="stat-label">Ultimo allenamento</span>
				<span class="stat-value stat-value--sm">{lastCompleted.exerciseName}</span>
				<span class="stat-meta"
					>{lastCompleted.description} · {formattedDate}</span
				>
			{:else}
				<span class="stat-label">Ultimo allenamento</span>
				<span class="stat-meta">Nessuno step completato</span>
			{/if}
		</div>
		<div class="stat-tile ios-card">
			<span class="stat-label">Passi fatti</span>
			<span class="stat-value">{completedSteps}</span>
		</div>
		<div class="stat-tile ios-card">
			<span class="stat-label">In corso</span>
			<span class="stat-value">{exercisesInProgress}</span>
		</div>
		<div class="stat-tile ios-card">
			<span class="stat-label">Completati</span>
			<span class="stat-value">{exercisesCompleted}</span>
		</div>
	</div>

	<div class="progress-block ios-card">
		<div class="progress-header">
			<span class="stat-label">Progresso totale</span>
			<span class="progress-pct">{overallPercent}%</span>
		</div>
		<ProgressBar pct={overallPercent} />
	</div>
</section>

<style>
	.home-stats {
		margin-bottom: 1.25rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.stat-tile {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-height: 4.5rem;
	}

	.stat-tile:first-child {
		grid-column: 1 / -1;
	}

	.stat-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-muted);
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.stat-value--sm {
		font-size: 1.125rem;
	}

	.stat-meta {
		font-size: 0.8125rem;
		color: var(--color-muted);
		line-height: 1.35;
	}

	.progress-block {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.progress-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.progress-pct {
		font-size: 1rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--color-accent);
	}
</style>
