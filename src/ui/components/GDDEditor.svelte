<script lang="ts">
	import { LudosStore } from '../../stores/store.svelte';
	import Overview from './sections/Overview.svelte';
	import Gameplay from './sections/Gameplay.svelte';
	import Story from './sections/Story.svelte';
	import Assets from './sections/Assets.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();

	let activeTab = $state('overview');

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'gameplay', label: 'Gameplay' },
		{ id: 'story', label: 'Story' },
		{ id: 'assets', label: 'Assets' }
	];
</script>

<div class="gdd-editor">
	<div class="tabs">
		{#each tabs as tab}
			<button
				class:active={activeTab === tab.id}
				onclick={() => activeTab = tab.id}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="content">
		{#if activeTab === 'overview'}
			<Overview {ludosStore} />
		{:else if activeTab === 'gameplay'}
			<Gameplay {ludosStore} />
		{:else if activeTab === 'story'}
			<Story {ludosStore} />
		{:else if activeTab === 'assets'}
			<Assets {ludosStore} />
		{/if}
	</div>
</div>

<style>
	.gdd-editor {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.tabs {
		display: flex;
		border-bottom: 1px solid var(--background-modifier-border);
		background-color: var(--background-secondary);
	}
	.tabs button {
		flex: 1;
		background: none;
		border: none;
		padding: 8px 0;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		color: var(--text-muted);
	}
	.tabs button.active {
		border-bottom-color: var(--interactive-accent);
		color: var(--text-normal);
		font-weight: bold;
	}
	.content {
		flex: 1;
		overflow-y: auto;
		padding: 10px;
	}
</style>
