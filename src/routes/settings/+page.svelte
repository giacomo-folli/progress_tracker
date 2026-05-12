<script lang="ts">
	import { exercises } from "$lib/stores/exercises";
	import { sessions } from "$lib/stores/sessions";
	import { exercisesFileTemplate, parseYamlString } from "$lib/utils/parsing";
	import { loadExercises } from "$lib/utils/storage";

	const current_exercises = loadExercises() ?? [];

	let loading = $state(false);
	async function handleResetProgress() {
		if (
			confirm(
				"Sei sicuro? Questo resetterà i progressi correnti.\nQuesto non cancellerà lo storico degli allenamenti",
			)
		) {
			loading = true;
			exercises.clearProgress();
			loading = false;
		}
	}

	async function handleClearTrainingHistory() {
		if (
			confirm("Sei sicuro? Questo cancellerà lo storico degli allenamenti.")
		) {
			loading = true;
			sessions.clearSessions();
			loading = false;
		}
	}

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;
		try {
			const fileContent = await file.text();
			const parsed = await parseYamlString(fileContent);

			exercises.reset(parsed ?? current_exercises);
			alert(
				"File caricato con successo. Ritorna alla home per vedere i cambiamenti.",
			);
		} catch (error) {
			console.error("Error reading file:", error);
		}
	}

	async function copyTemplate() {
		try {
			await navigator.clipboard.writeText(exercisesFileTemplate);
			alert("Template copiato negli appunti");
		} catch (error) {
			console.error("Copy failed:", error);
		}
	}
</script>

<div class="settings-container">
	<div>
		<div class="upload-file-section">
			<div>Carica un file custom (formato .yaml)</div>
			<button class="btn-upload-file" onclick={copyTemplate}
				>Copia il template</button
			>
		</div>

		<div>
			<input type="file" accept=".yaml" onchange={handleFileUpload} />
		</div>
	</div>

	<div class="danger-zone">
		<div>Danger zone!</div>
		<button
			class="btn-reset-file"
			onclick={handleResetProgress}
			disabled={loading}>Resetta i progressi</button
		><button
			class="btn-reset-file"
			onclick={handleClearTrainingHistory}
			disabled={loading}>Elimina lo storico allenamenti</button
		>
	</div>
</div>

<style>
	.upload-file-section {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.settings-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 2rem;
	}

	.danger-zone {
		background: rgba(255, 0, 0, 0.2);
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: start;
		gap: 0.5rem;
		border: none;
		border-radius: 7px;
		padding: 0.5rem;
	}

	.btn-upload-file {
		background: var(--color-card);
		color: white;
		border: none;
		border-radius: 7px;
		padding: 0.5rem 1rem;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.1s;
	}

	.btn-reset-file {
		background: rgba(255, 0, 0, 0.2);
		color: white;
		border: none;
		border-radius: 7px;
		padding: 0.5rem 1rem;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.1s;
	}

	.btn-reset-file:hover,
	.btn-upload-file:hover {
		opacity: 0.85;
	}
</style>
