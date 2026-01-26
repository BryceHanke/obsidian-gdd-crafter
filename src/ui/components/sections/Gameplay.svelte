<script lang="ts">
	import { LudosStore } from '../../../stores/store.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();
	let gddData = $derived(ludosStore.gddData);

	function update(section: 'coreLoop' | 'mechanics', value: string) {
		ludosStore.updateBodySection(section, value);
	}
</script>

{#if gddData}
	<div class="section">
		<div class="form-group">
			<label for="coreLoop">Core Loop</label>
			<textarea id="coreLoop" rows="6" value={gddData.coreLoop} onchange={(e) => update('coreLoop', e.currentTarget.value)}></textarea>
		</div>
		<div class="form-group">
			<label for="mechanics">Mechanics</label>
			<textarea id="mechanics" rows="10" value={gddData.mechanics} onchange={(e) => update('mechanics', e.currentTarget.value)}></textarea>
		</div>
	</div>
{/if}

<style>
	.section { padding: 10px; }
	.form-group { margin-bottom: 15px; }
	label { display: block; margin-bottom: 5px; font-weight: bold; }
	textarea { width: 100%; resize: vertical; }
</style>
