<script lang="ts">
	import { LudosStore } from '../../stores/store.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();

	async function initialize() {
		await ludosStore.initializeGDD();
	}
</script>

<div class="empty-state">
	<h3>No Game Design Document Found</h3>
	<p>This file is not marked as a GDD.</p>
	<button onclick={initialize}>Initialize Game Design Document</button>
</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 20px;
		text-align: center;
	}
	button {
		margin-top: 15px;
		cursor: pointer;
	}
</style>
