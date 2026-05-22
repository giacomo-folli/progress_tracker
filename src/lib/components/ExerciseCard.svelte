<script lang="ts">
	import { resolve } from "$app/paths";
	import type { Step } from "$lib/types";
	import ProgressBar from "./ProgressBar.svelte";

	let {
		id,
		name,
		pct,
		completedCount,
		total,
		current,
		next,
		isComplete,
	}: {
		id: string;
		name: string;
		pct: number;
		completedCount: number;
		total: number;
		current: Pick<Step, "description"> | null;
		next: Pick<Step, "description"> | null;
		isComplete: boolean;
	} = $props();
</script>

<a
	href={resolve("/exercises/[id]", { id })}
	class="card ios-card"
	class:done={isComplete}
>
	<div class="card-header">
		<span class="name">{name}</span>
		<span class="pct">{pct}%</span>
	</div>

	<ProgressBar {pct} />

	<div class="card-body">
		{#if isComplete}
			<p class="step-label complete-label">✓ Completato</p>
		{:else}
			<p class="step-label">
				<span class="step-meta">Ora</span>
				<span class="step-value"> {current?.description ?? "—"}</span>
			</p>
			{#if next}
				<p class="step-label next">
					<span class="step-meta">Prossimo</span>
					<span class="step-value"> {next.description} </span>
				</p>
			{/if}
		{/if}
	</div>

	<div class="card-footer">
		<span class="count">{completedCount}/{total} steps</span>
	</div>
</a>

<style>
	.card {
		display: block;
		text-decoration: none;
		color: inherit;
		padding: 1.25rem 1.125rem;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		cursor: pointer;
	}

	.card:active {
		transform: scale(0.98);
	}

	.card.done {
		opacity: 0.6;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.75rem;
	}

	.name {
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--color-text);
	}

	.pct {
		font-size: 0.8rem;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}

	.card-body {
		margin-top: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.step-label {
		margin: 0;
		font-size: 0.85rem;
		color: var(--color-text);
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
	}

	.step-value {
		text-overflow: ellipsis;

		/* Needed to make it work */
		overflow: hidden;
		white-space: nowrap;
	}

	.step-label.next {
		color: var(--color-muted);
	}

	.step-meta {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-muted);
		min-width: 2.5rem;
		flex-shrink: 0;
	}

	.complete-label {
		color: var(--color-accent);
		font-weight: 500;
	}

	.card-footer {
		margin-top: 0.9rem;
	}

	.count {
		font-size: 0.75rem;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
</style>
