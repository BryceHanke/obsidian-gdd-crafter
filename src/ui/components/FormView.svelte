<script lang="ts">
	import { LudosStore } from '../../stores/store.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();

	// Define a simple schema based on active file type (mocked)
	let schema = $derived.by(() => {
		if (ludosStore.activeFileType === 'mechanic/verb') {
			return [
				{ key: 'input', label: 'Input', type: 'text' },
				{ key: 'cooldown', label: 'Cooldown (ms)', type: 'number' },
				{ key: 'interruptible', label: 'Interruptible', type: 'boolean' }
			];
		}
		return [];
	});

	let formData = $state<Record<string, any>>({});

	$effect(() => {
		if (ludosStore.activeFile) {
			const cache = ludosStore.app.metadataCache.getFileCache(ludosStore.activeFile);
			if (cache && cache.frontmatter) {
				formData = { ...cache.frontmatter };
			}
		}
	});

	async function updateField(key: string, value: any) {
		formData[key] = value;
		if (ludosStore.activeFile) {
			await ludosStore.app.fileManager.processFrontmatter(ludosStore.activeFile, (frontmatter) => {
				frontmatter[key] = value;
			});
		}
	}
</script>

{#if schema.length > 0}
	<div class="form-view">
		<h3>Properties</h3>
		{#each schema as field}
			<div class="form-group">
				<label for={field.key}>{field.label}</label>
				{#if field.type === 'text'}
					<input
						type="text"
						id={field.key}
						value={formData[field.key] || ''}
						oninput={(e) => updateField(field.key, e.currentTarget.value)}
					/>
				{:else if field.type === 'number'}
					<input
						type="number"
						id={field.key}
						value={formData[field.key] || 0}
						oninput={(e) => updateField(field.key, Number(e.currentTarget.value))}
					/>
				{:else if field.type === 'boolean'}
					<input
						type="checkbox"
						id={field.key}
						checked={formData[field.key] || false}
						onchange={(e) => updateField(field.key, e.currentTarget.checked)}
					/>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	.form-view {
		background-color: var(--background-secondary);
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 10px;
	}
	.form-group {
		margin-bottom: 8px;
		display: flex;
		flex-direction: column;
	}
	label {
		font-size: 0.8em;
		color: var(--text-muted);
		margin-bottom: 2px;
	}
	input[type="text"], input[type="number"] {
		background-color: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		padding: 4px;
		border-radius: 4px;
	}
</style>
