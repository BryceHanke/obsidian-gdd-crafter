<script lang="ts">
	import { TFile } from 'obsidian';
	import { LudosStore } from '../stores/store.svelte';
	import Checklist from './components/Checklist.svelte';
	import FormView from './components/FormView.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();

	let activeFile = $derived(ludosStore.activeFile);
	let activeFileType = $derived(ludosStore.activeFileType);

</script>

<div class="ludos-container">
	{#if activeFile}
		<h2>{activeFile.basename}</h2>

		{#if activeFileType}
			<div class="type-badge">{activeFileType}</div>

			<FormView {ludosStore} />

			{#if activeFileType === 'mechanic/interaction' || activeFileType === 'entity/door'}
				<div class="checklist-section">
					<h3>The Door Problem Checklist</h3>
					<Checklist {ludosStore} />
				</div>
			{/if}

		{:else}
			<p class="empty-state">No type defined in frontmatter.</p>
		{/if}
	{:else}
		<p class="empty-state">No active markdown file.</p>
	{/if}
</div>

<style>
	.ludos-container {
		padding: 10px;
	}
	.type-badge {
		background-color: var(--interactive-accent);
		color: var(--text-on-accent);
		padding: 4px 8px;
		border-radius: 4px;
		display: inline-block;
		margin-bottom: 10px;
		font-size: 0.8em;
	}
	.checklist-section {
		margin-top: 20px;
		border-top: 1px solid var(--background-modifier-border);
		padding-top: 10px;
	}
	.empty-state {
		color: var(--text-muted);
		font-style: italic;
	}
</style>
