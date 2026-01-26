<script lang="ts">
	import { LudosStore } from '../stores/store.svelte';
	import GDDEditor from './components/GDDEditor.svelte';
	import EmptyState from './components/EmptyState.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();

	let activeFile = $derived(ludosStore.activeFile);
	let isGDD = $derived(ludosStore.isGDD);
</script>

<div class="ludos-container">
	{#if activeFile}
		{#if isGDD}
			<GDDEditor {ludosStore} />
		{:else}
			<EmptyState {ludosStore} />
		{/if}
	{:else}
		<div class="no-file">
			<p>Open a markdown file to start.</p>
		</div>
	{/if}
</div>

<style>
	.ludos-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.no-file {
		padding: 20px;
		text-align: center;
		color: var(--text-muted);
	}
</style>
