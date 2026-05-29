<script lang="ts">
	import StepList from "$lib/components/StepList.svelte";
	import ProgressBar from "$lib/components/ProgressBar.svelte";
	import { exercises } from "$lib/stores/exercises";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import type { Exercise } from "$lib/types";
	import posthog from "posthog-js";
	import { resolve } from "$app/paths";

	const id = $state(page.params.id);

	let exercise: Exercise | undefined = $state(
		$exercises.find((e) => e.id === id),
	);

	exercises.subscribe((r) => {
		exercise = r.find((e) => e.id === id);
	});

	let completedCount = $derived(
		exercise?.steps?.filter((s) => s.completed).length ?? 0,
	);
	let total = $derived(exercise?.steps?.length ?? 0);
	let isComplete = $derived(completedCount === total);
	let pct = $derived(
		total === 0 ? 0 : Math.round((completedCount / total) * 100),
	);

	let currentStep = $derived(
		exercise?.steps?.[exercise.current_step_index!] ?? null,
	);
	let hasCompleted = $derived((exercise?.steps ?? []).some((s) => s.completed));

	// Delete confirmation state
	let showDeleteConfirm = $state(false);

	function completeStep() {
		if (!exercise) return;

		posthog.capture("exercise_step_completed", {
			exercise_id: exercise.id,
			exercise_name: exercise.name,
			step_index: exercise.current_step_index ?? 0,
			steps_completed: completedCount + 1,
			total_steps: total,
		});

		exercises.completeCurrentStep(exercise.id);
	}

	function undoStep() {
		if (!exercise) return;

		posthog.capture("exercise_step_undone", {
			exercise_id: exercise.id,
			exercise_name: exercise.name,
			step_index: exercise.current_step_index ?? 0,
		});

		exercises.undoLastCompletion(exercise.id);
	}

	function confirmDelete() {
		showDeleteConfirm = true;
	}

	function cancelDelete() {
		showDeleteConfirm = false;
	}

	function deleteExercise() {
		if (!exercise) return;

		posthog.capture("exercise_deleted", {
			exercise_id: exercise.id,
			exercise_name: exercise.name,
		});

		exercises.remove(exercise.id);
		goto(resolve("/exercises"));
	}

	function handleBackdropClick(e: MouseEvent) {
		if ((e.target as HTMLElement).classList.contains("confirm-backdrop")) {
			cancelDelete();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") cancelDelete();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if exercise}
	<div class="page-layout">
		<header class="ex-header">
			<div class="title-row">
				<h1>{exercise.name}</h1>
				<button
					class="delete-btn"
					onclick={confirmDelete}
					aria-label="Elimina esercizio"
					title="Elimina esercizio"
				>
					<i class="ti ti-trash"></i>
				</button>
			</div>
			<div class="progress-row">
				<ProgressBar {pct} />
				<span class="pct-label">{pct}%</span>
			</div>
			<p class="step-count">
				{completedCount} of {total} steps completed
			</p>
		</header>

		{#if !isComplete}
			<section class="current-section">
				<p class="section-label">Current step</p>
				<div class="current-step-box">
					<p class="current-step-label">
						{currentStep?.description ?? "—"}
					</p>
					<button class="btn btn--primary btn-complete" onclick={completeStep}>
						Mark complete
					</button>
				</div>
			</section>
		{:else}
			<section class="current-section">
				<div class="complete-banner">All steps completed ✓</div>
			</section>
		{/if}

		<section class="steps-section-wrapper">
			<div class="steps-header">
				<p class="section-label">All steps</p>
				{#if hasCompleted}
					<button class="btn btn--secondary btn-undo" onclick={undoStep}>
						Undo last
					</button>
				{/if}
			</div>
			<div class="steps-section-card">
				{#if exercise.steps && exercise.current_step_index !== undefined}
					<StepList
						steps={exercise.steps}
						current_step_index={exercise.current_step_index}
					/>
				{/if}
			</div>
		</section>
	</div>
{:else}
	<div class="page-layout">
		<p>Exercise not found.</p>
	</div>
{/if}

<!-- Delete confirmation sheet -->
{#if showDeleteConfirm}
	<div
		class="confirm-backdrop"
		role="presentation"
		onclick={handleBackdropClick}
	>
		<div
			class="confirm-sheet ios-card"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
		>
			<div class="drag-handle"></div>

			<div class="confirm-body">
				<div class="confirm-icon">
					<i class="ti ti-trash"></i>
				</div>
				<h2 id="confirm-title">Elimina esercizio</h2>
				<p class="confirm-desc">
					Vuoi eliminare <strong>{exercise?.name}</strong>? Questa azione non
					può essere annullata.
				</p>
			</div>

			<div class="confirm-actions">
				<button
					class="btn btn--danger confirm-delete-btn"
					onclick={deleteExercise}
				>
					Elimina
				</button>
				<button
					class="btn btn--secondary confirm-cancel-btn"
					onclick={cancelDelete}
				>
					Annulla
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.page-layout {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		padding-bottom: 2rem;
	}

	/* ── Header ── */
	.title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.ex-header h1 {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--color-text);
	}

	/* ── Delete button ── */
	.delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 50%;
		background: transparent;
		color: var(--color-danger);
		font-size: 1.05rem;
		padding: 0;
		flex-shrink: 0;
		transition:
			background 0.15s ease,
			color 0.15s ease;
		background: rgba(255, 59, 48, 0.1);
	}

	.delete-btn:active {
		background: rgba(255, 59, 48, 0.18);
	}

	.progress-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.progress-row :global(.progress-track) {
		flex: 1;
	}

	.pct-label {
		font-size: 0.85rem;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.step-count {
		margin: 0.5rem 0 0;
		font-size: 0.85rem;
		color: var(--color-muted);
	}

	.section-label {
		margin: 0 0 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.current-step-box {
		background: var(--color-card, #1c1c1e);
		border: 1px solid var(--color-border, #2c2c2e);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.current-step-label {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.btn-complete {
		padding: 0.75rem 1.25rem;
		font-size: 0.9rem;
		font-weight: 600;
		border-radius: 8px;
		background-color: var(--color-accent, #2c974b);
		color: white;
		border: none;
		cursor: pointer;
		transition: opacity 0.2s;
		white-space: nowrap;
	}

	.btn-complete:hover {
		opacity: 0.9;
	}

	.complete-banner {
		background: rgba(44, 151, 75, 0.15);
		color: var(--color-accent, #2c974b);
		border-radius: 12px;
		padding: 1rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		text-align: center;
		border: 1px solid rgba(44, 151, 75, 0.3);
	}

	.steps-section-wrapper {
		display: flex;
		flex-direction: column;
	}

	.steps-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.steps-header .section-label {
		margin: 0;
	}

	.steps-section-card {
		background: var(--color-card, #1c1c1e);
		border: 1px solid var(--color-border, #2c2c2e);
		border-radius: 12px;
		padding: 1rem 1.25rem;
	}

	.btn-undo {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--color-border, #2c2c2e);
		border-radius: 6px;
		padding: 0.4rem 0.8rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-undo:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}

	/* ── Confirm sheet ── */
	.confirm-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 100;
		animation: fade-in 0.18s ease;
	}

	@media (min-width: 520px) {
		.confirm-backdrop {
			align-items: center;
			padding: 1rem;
		}
	}

	.confirm-sheet {
		width: 100%;
		max-width: 480px;
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		padding: 0;
		box-shadow: 0 -2px 24px rgba(0, 0, 0, 0.14);
		animation: slide-up 0.24s cubic-bezier(0.32, 1.2, 0.6, 1);
		overflow: hidden;
	}

	@media (min-width: 520px) {
		.confirm-sheet {
			border-radius: var(--radius-lg);
			box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
			animation: pop-in 0.22s cubic-bezier(0.32, 1.2, 0.6, 1);
		}
	}

	.drag-handle {
		width: 36px;
		height: 4px;
		border-radius: 2px;
		background: var(--color-track);
		margin: 0.75rem auto 0;
	}

	@media (min-width: 520px) {
		.drag-handle {
			display: none;
		}
	}

	.confirm-body {
		padding: 1.5rem 1.5rem 1rem;
		text-align: center;
	}

	.confirm-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: rgba(255, 59, 48, 0.12);
		color: var(--color-danger);
		font-size: 1.4rem;
		margin-bottom: 0.85rem;
	}

	.confirm-body h2 {
		margin: 0 0 0.5rem;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--color-text);
	}

	.confirm-desc {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-muted);
		line-height: 1.5;
	}

	.confirm-desc strong {
		color: var(--color-text);
		font-weight: 600;
	}

	.confirm-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.5rem 1.25rem 1.5rem;
	}

	.confirm-delete-btn,
	.confirm-cancel-btn {
		width: 100%;
		text-align: center;
		border-radius: var(--radius-card);
		padding: 0.8rem;
		font-size: 0.95rem;
	}

	/* ── Animations ── */
	@media (max-width: 480px) {
		.current-step-box {
			flex-direction: column;
			align-items: flex-start;
			gap: 1.25rem;
		}

		.btn-complete {
			width: 100%;
			text-align: center;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(56px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes pop-in {
		from {
			transform: scale(0.93);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
