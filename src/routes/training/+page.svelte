<script lang="ts">
	import { resolve } from "$app/paths";
	import { exercises } from "$lib/stores/exercises";
	import { sessions } from "$lib/stores/sessions";
	import type { SessionExercise } from "$lib/types";
	import CelebrationOverlay from "$lib/components/CelebrationOverlay.svelte";

	let program = $derived(
		$exercises
			.filter((ex) => ex.currentStepIndex < ex.steps.length)
			.map((ex) => ({
				exerciseId: ex.id,
				exerciseName: ex.name,
				stepLabel: ex.steps[ex.currentStepIndex]?.description ?? "—",
				checked: true,
			})),
	);

	
	let celebrating = $state(false);

	function logSession() {
		if (program.length === 0) return;
		const snapshot: SessionExercise[] = program
			.filter((ex) => ex.checked)
			.map((p) => {
				const { checked, ...rest } = p;
				return rest;
			});

		sessions.logSession(snapshot);
		celebrating = true;
	}

	

	// add inside your existing <script>
	const quickExercises = [
		{ id: "corsa", icon: "🏃", label: "Corsa" },
		{ id: "bici", icon: "🚴", label: "Bicicletta" },
		{ id: "nuoto", icon: "🏊", label: "Nuoto" },
		{ id: "pesi", icon: "🏋️", label: "Pesi liberi" },
		{ id: "yoga", icon: "🧘", label: "Yoga" },
		{ id: "camminata", icon: "🚶", label: "Camminata" },
		{ id: "calcio", icon: "⚽", label: "Calcio" },
		{ id: "stretching", icon: "🤸", label: "Stretching" },
		{ id: "corda", icon: "🪢", label: "Corda" },
		{ id: "boxe", icon: "🥊", label: "Boxe" },
	];

	let selectedQuick = $state<Set<string>>(new Set());

	function toggleQuick(id: string) {
		selectedQuick = new Set(
			selectedQuick.has(id)
				? [...selectedQuick].filter((x) => x !== id)
				: [...selectedQuick, id],
		);
	}
</script>

<!-- Celebration overlay (portal-like, fixed position) -->
<CelebrationOverlay
	visible={celebrating}
	onDone={() => (celebrating = false)}
/>

<div class="training-layout">
	<!-- LEFT: current program -->
	<section class="col col-program">
		<header class="col-header">
			<div>
				<h2>Programma attuale</h2>
				<p class="col-sub">{program.length} esercizi</p>
			</div>
			<button
				class="btn btn--primary btn-log"
				onclick={logSession}
				disabled={program.length === 0 || celebrating}
			>
				Registra sessione
			</button>
		</header>

		<ol class="program-list">
			{#each program as item (item.exerciseId)}
				<li class="program-item">
					<a
						href={resolve(`/exercises/${item.exerciseId}`)}
						class="program-link"
					>
						<span class="ex-name">{item.exerciseName}</span>
						<span class="ex-step">{item.stepLabel}</span>
					</a>

					<input
						type="checkbox"
						id={item.exerciseId}
						bind:checked={item.checked}
					/>
				</li>
			{/each}
		</ol>
	</section>

	<hr class="quick-divider" />

	<!-- Quick exercises -->
	<section class="quick-section">
		<p class="quick-label">Esercizi rapidi</p>
		<div class="quick-grid">
			{#each quickExercises as ex (ex.id)}
				<button
					class="quick-box"
					class:active={selectedQuick.has(ex.id)}
					onclick={() => toggleQuick(ex.id)}
					aria-pressed={selectedQuick.has(ex.id)}
				>
					<span class="quick-icon" aria-hidden="true">{ex.icon}</span>
					<span class="quick-label-text">{ex.label}</span>
				</button>
			{/each}
		</div>
	</section>
</div>

<style>
	.training-layout {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 2rem;
		align-items: start;
	}

	.col-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.25rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--color-text);
	}

	.col-sub {
		margin: 0.2rem 0 0;
		font-size: 0.78rem;
		color: var(--color-muted);
	}

	/* Program list */
	.program-list {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		overflow: hidden;
	}

	.program-item {
		border-bottom: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem 0 0;
	}

	.program-item:last-child {
		border-bottom: none;
	}

	input[type="checkbox"] {
		width: 1.35rem;
		height: 1.35rem;
		min-width: 1.35rem;
		min-height: 1.35rem;
		accent-color: var(--color-primary);
		cursor: pointer;
	}

	.program-link {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		padding: 0.8rem 1.2rem;
		text-decoration: none;
		color: inherit;
		transition: background 0.12s;
	}

	.ex-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	.ex-step {
		font-size: 0.8rem;
		color: var(--color-muted);
		text-align: right;
		flex-shrink: 0;
	}

	.btn-log {
		flex-shrink: 0;
	}

	
	/* --- Mobile --- */
	@media (max-width: 768px) {
		.training-layout {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.col-header {
			gap: 0.75rem;
		}

		.program-link {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.3rem;
			padding: 0.8rem 1rem;
		}

		.ex-name {
			white-space: normal;
			word-wrap: break-word;
		}

		.ex-step {
			text-align: left;
			font-size: 0.75rem;
		}
	}

	.quick-section {
		/* margin-bottom: 1.5rem; */
	}

	.quick-label {
		margin: 0 0 0.75rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.quick-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
		gap: 0.5rem;
	}

	.quick-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.75rem 0.5rem;
		border-radius: 10px;
		border: 1px solid var(--color-border);
		background: var(--color-card);
		cursor: pointer;
		transition:
			background 0.12s,
			border-color 0.12s;
	}

	.quick-box:hover {
		background: var(--color-track);
	}

	.quick-box.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
	}

	.quick-box.active .quick-label-text {
		color: #fff;
	}

	.quick-icon {
		font-size: 1.4rem;
		line-height: 1;
	}

	.quick-label-text {
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--color-text);
		text-align: center;
		line-height: 1.2;
	}

	.quick-divider {
		border: none;
		border-top: 1px solid var(--color-border);
		margin: 0 0 2rem;
	}
</style>
