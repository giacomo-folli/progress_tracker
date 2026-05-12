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

	async function handleUploadFromClipboard() {
		try {
			const clipboardText = await navigator.clipboard.readText();
			if (!clipboardText) {
				alert("Il clipboard è vuoto.");
				return;
			}

			const parsed = await parseYamlString(clipboardText);
			exercises.reset(parsed ?? current_exercises);
			alert(
				"Contenuto del clipboard caricato con successo. Ritorna alla home per vedere i cambiamenti.",
			);
		} catch (error) {
			console.error("Clipboard read failed:", error);
			alert(
				"Impossibile leggere il clipboard. Controlla i permessi del browser.",
			);
		}
	}
</script>

<div class="settings-container">
	<div class="upload-zone">
		<div class="upload-file-section">
			<div>Carica un file custom (formato .yaml)</div>

			<button class="btn-copy-template" onclick={copyTemplate}
				>Copia il template</button
			>
		</div>

		<div class="input-group">
			<div class="file-input">
				<input type="file" accept=".yaml" onchange={handleFileUpload} />
			</div>
			<div class="clipboard-input">
				<button class="clipboard-button" onclick={handleUploadFromClipboard}
					>Incolla dal clipboard</button
				>
			</div>
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
		gap: 0.5rem;
		flex-direction: column;
		justify-content: space-between;
		align-items: start;
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

	button {
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

	.btn-copy-template {
		width: 100%;
		background: var(--color-card);
	}

	.btn-reset-file {
		background: rgba(255, 0, 0, 0.2);
	}

	.btn-reset-file:hover,
	.btn-copy-template:hover {
		opacity: 0.85;
	}

	.file-input {
		margin-top: 0.5rem;
		background: rgba(100, 200, 100, 0.1);
		width: 100%;
		border: none;
		border-radius: 7px;
		padding: 0.5rem;
	}

	.clipboard-input {
		margin-top: 0.5rem;
		display: flex;
		align-items: center;
		background: rgba(100, 200, 100, 0.1);
		width: 100%;
		border: none;
		border-radius: 7px;
		padding: 0.5rem;
	}

	.clipboard-button {
		margin: none;
		color: var(--color-text);
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: baseline;
		background: transparent;
		border: none;
		padding: 0;
	}

	.input-group {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Responsiveness for slightly larger screens */
	@media (min-width: 480px) {
		.upload-file-section {
			flex-direction: row;
		}

		.btn-copy-template {
			width: fit-content;
		}

		.input-group {
			flex-direction: row;
		}
	}
</style>
