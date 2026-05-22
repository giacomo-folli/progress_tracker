<script lang="ts">
	import { sessions } from "$lib/stores/sessions";
	import {
		avgSessionsPerWeek,
		currentStreak,
		formatLastSessionRelative,
		longestStreak,
	} from "$lib/utils/sessions-stats";

	const totalSessions = $derived($sessions.length);
	const streak = $derived(currentStreak($sessions));
	const record = $derived(longestStreak($sessions));
	const avgWeek = $derived(avgSessionsPerWeek($sessions));
	const lastRelative = $derived(formatLastSessionRelative($sessions));
</script>

<section class="cadence">
	<p class="ios-section-label">Sessioni</p>
	<div class="chip-row">
		<div class="chip ios-card">
			<span class="chip-value">{totalSessions}</span>
			<span class="chip-label">Totali</span>
		</div>
		<div class="chip ios-card">
			<span class="chip-value">{avgWeek}</span>
			<span class="chip-label">/ settimana</span>
		</div>
		<div class="chip ios-card">
			<span class="chip-value">{streak}</span>
			<span class="chip-label">Streak</span>
		</div>
		<div class="chip ios-card">
			<span class="chip-value">{record}</span>
			<span class="chip-label">Record</span>
		</div>
	</div>
	<p class="last-hint">Ultima sessione: {lastRelative}</p>
</section>

<style>
	.cadence {
		margin-bottom: 1.25rem;
	}

	.chip-row {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
	}

	.chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem 0.35rem;
		text-align: center;
	}

	.chip-value {
		font-size: 1.25rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		line-height: 1.1;
		color: var(--color-text);
	}

	.chip-label {
		font-size: 0.625rem;
		color: var(--color-muted);
		margin-top: 0.2rem;
	}

	.last-hint {
		margin: 0.5rem 0 0;
		font-size: 0.8125rem;
		color: var(--color-muted);
	}
</style>
