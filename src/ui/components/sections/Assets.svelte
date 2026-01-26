<script lang="ts">
	import { LudosStore } from '../../../stores/store.svelte';

	interface Props {
		ludosStore: LudosStore;
	}

	let { ludosStore }: Props = $props();
	let gddData = $derived(ludosStore.gddData);

	function update(section: 'visualStyle' | 'audioStyle', value: string) {
		ludosStore.updateBodySection(section, value);
	}
</script>

{#if gddData}
	<div class="section">
		<div class="form-group">
			<label for="visualStyle">Visual Style</label>
			<textarea id="visualStyle" rows="6" value={gddData.visualStyle} onchange={(e) => update('visualStyle', e.currentTarget.value)}></textarea>
		</div>
		<div class="form-group">
			<label for="audioStyle">Audio Style</label>
			<textarea id="audioStyle" rows="6" value={gddData.audioStyle} onchange={(e) => update('audioStyle', e.currentTarget.value)}></textarea>
		</div>
	</div>
{/if}
<style>
	.section { padding: 10px; }
	.form-group { margin-bottom: 15px; }
	label { display: block; margin-bottom: 5px; font-weight: bold; }
	textarea { width: 100%; resize: vertical; }
</style>
